import { isObject } from "lodash";
import { HTMLAttributes } from "react";
import { PureComponent, DangerousHtml } from "@stejar/react";
import { connect } from "react-redux";
import { Selector } from "@stejar/redux";
import { LocaleQueries } from "./LocaleQueries";

export interface TranslateProps extends HTMLAttributes<any> {
	[key: string]: any;
	[key: number]: any;
	catalogs?: {[key: string]: {[key: string]: string}};
	_$locale?: string;
}

@(connect as any)(Selector.fromState({
	catalogs: LocaleQueries.getLocaleCatalogs,
	_$locale: LocaleQueries.getCurrentLocale,
}))
export class Translate extends PureComponent<TranslateProps,{}> {

	/**
	 * @returns {JSX.Element}
	 */
	render(): JSX.Element {
		let params = Object.assign({}, this.props);
		delete params.children;
		delete params.catalogs;
		delete params._$locale;
		let translatedValue: string;
		try {
			translatedValue = this.props.catalogs[ this.props._$locale ][ this.props.children as any ];
			if ( !translatedValue ) {
				translatedValue = this.props.children as any;
			}
		} catch (error) {
			translatedValue = this.props.children as any;
		}

		let list: string[] = [];
		Object.keys(params).forEach(name => {
			if ( isObject(params[ name ]) ) {
				list.push(params[ name ]);

				try {
					translatedValue = translatedValue.replace(`%(${name})`, '{REACT}');
				} catch (error) {
					console.error(error);
					console.warn(translatedValue);
					console.warn(name);
				}
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
				newResult.push(<DangerousHtml key={offset}>{item}</DangerousHtml>);
				if ( list.length > 0 ) {
					offset++;
					newResult.push(<span key={offset}>{list.shift()}</span>);
				}
			});

			return (
				<span>
                    {[ null ].concat(newResult)}
                </span>
			);
		}

		if ( -1 !== translatedValue.indexOf('&') || (-1 !== translatedValue.indexOf('<') && -1 !== translatedValue.indexOf('>')) ) {
			return <DangerousHtml>{translatedValue}</DangerousHtml>;
		}

		return <span>{translatedValue}</span>;
	}
}
