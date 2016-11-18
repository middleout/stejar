import Helmet from "react-helmet";
import { HTMLAttributes } from "react";
import { PureComponent } from "@stejar/react";
import { inject } from "@stejar/react-di";
import { TranslatorService } from "./TranslatorService";

export interface LocalizedTitleProps extends HTMLAttributes<any> {
	[key: string]: any;
	[key: number]: any;
	translatorService?: TranslatorService;
}

@inject({
	translatorService: TranslatorService
})
export class LocalizedTitle extends PureComponent<LocalizedTitleProps,{}> {

	/**
	 * @returns {JSX.Element}
	 */
	render(): JSX.Element {
		let params = Object.assign({}, this.props);
		delete params.children;
		let translatedValue: string = this.props.translatorService.translate(this.props.children as any);

		Object.keys(params).forEach(name => {
			translatedValue = translatedValue.replace(`%(${name})`, params[ name ]);
		});

		return <Helmet title={translatedValue} />;
	}
}
