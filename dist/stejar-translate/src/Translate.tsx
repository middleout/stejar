import { isObject } from "lodash";
import { HTMLAttributes } from "react";
import { PureComponent } from "@stejar/react";
import { inject } from "@stejar/react-di";
import { TranslatorService } from "./TranslatorService";

export interface TranslateProps extends HTMLAttributes<any> {
	[key: string]: any;
	[key: number]: any;
	translatorService?: TranslatorService;
}

@inject({
	translatorService: TranslatorService
})
export class Translate extends PureComponent<TranslateProps,{}> {

	/**
	 * @type {Function}
	 */
	protected unsubscribe: Function = (): Function => null;

	/**
	 * @returns {JSX.Element}
	 */
	render(): JSX.Element {
		let params = Object.assign({}, this.props);
		delete params.children;
		delete params.translatorService;
		let translatedValue: string = this.props.translatorService.translate(this.props.children as any);

		let list: string[] = [];
		Object.keys(params).forEach(name => {
			if ( isObject(params[ name ]) ) {
				list.push(params[ name ]);
				translatedValue = translatedValue.replace(`%(${name})`, '{REACT}');
			} else {
				translatedValue = translatedValue.replace(`%(${name})`, params[ name ]);
			}
		});

		if ( Object.keys(list).length > 0 ) {
			let result           = translatedValue.split('{REACT}');
			let newResult: any[] = [];
			let offset           = 0;
			result.forEach(( item: any ) => {
				offset++;
				newResult.push(<span dangerouslySetInnerHTML={{__html: item as string}} key={offset} />);
				if ( list.length > 0 ) {
					offset++;
					newResult.push(<span dangerouslySetInnerHTML={{__html: list.shift()}} key={offset} />);
				}
			});

			return (
				<span>
                    {[ null ].concat(newResult)}
                </span>
			);
		}

		if ( -1 !== translatedValue.indexOf('&') || (-1 !== translatedValue.indexOf('<') && -1 !== translatedValue.indexOf('>')) ) {
			return <span dangerouslySetInnerHTML={{__html: translatedValue}} />;
		}

		return <span>{translatedValue}</span>;
	}

	/**
	 * @returns {null}
	 */
	componentDidMount(): void {
		this.unsubscribe = this.props.translatorService.activeLocale$.subscribe(locale => this.setState({locale}));
		return null;
	}

	/**
	 * @returns {null}
	 */
	componentWillUnmount(): void {
		this.unsubscribe();
		return null;
	}
}
