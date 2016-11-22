export function VersionCard( props: {position?: "tr"|"tl"|"br"|"bl", configVersion: string, buildTarget: string, configEnv: string, npmVersion: string, nodeEnv: string, buildVersion: string, config: Object, configCard?: boolean, versionCard?: boolean} ) {

	// localStorage.setItem("@versionCard", true);
	// localStorage.removeItem("@versionCard");

	// localStorage.setItem("@configCard", true);
	// localStorage.removeItem("@configCard");

	const showVersionCard = localStorage.getItem('@versionCard') ? true : props.versionCard ? true : false;
	const showConfigCard  = localStorage.getItem('@configCard') ? true : props.configCard ? true : false;

	let wrapperStyle = {
		position: "fixed",
	};

	const containerStyle = {
		padding        : "10px",
		backgroundColor: "#F4645F",
		color          : "#fff",
		borderRadius   : "5px",
		fontFamily     : "Verdana",
		fontSize       : "12px",
		cursor         : "pointer",
		opacity        : 0.8,
		boxShadow      : "3px 3px 3px 3px #ccc",
		marginBottom   : "15px",
	};

	const configStyle = {
		padding        : "10px",
		backgroundColor: "#FFC513",
		color          : "#333",
		borderRadius   : "5px",
		fontFamily     : "Verdana",
		fontSize       : "12px",
		cursor         : "pointer",
		opacity        : 0.8,
		boxShadow      : "3px 3px 3px 3px #ccc",
		marginBottom   : "15px",
	};

	switch ( props.position || "br" ) {
		case "tr":
			wrapperStyle[ "right" ] = "15px";
			wrapperStyle[ "top" ]   = "15px";
			break;
		case "tl":
			wrapperStyle[ "left" ] = "15px";
			wrapperStyle[ "top" ]  = "15px";
			break;
		case "br":
			wrapperStyle[ "right" ]  = "15px";
			wrapperStyle[ "bottom" ] = "15px";
			break;
		case "bl":
			wrapperStyle[ "left" ]   = "15px";
			wrapperStyle[ "bottom" ] = "15px";
			break;
	}

	const titleStyle = {
		fontSize     : "13px",
		fontWeight   : 600,
		borderBottom : "1px solid #eee",
		marginBottom : "10px",
		paddingBottom: "5px",
		textAlign    : "center"
	};
	const itemStyle  = {
		marginBottom: "5px"
	};

	const versionCard = (
		<div style={containerStyle}>
			<div style={titleStyle}>
				Stejar Version Card
			</div>
			<div style={itemStyle}>
				Config version: <strong>{props.configVersion}</strong>
			</div>
			<div style={itemStyle}>
				NPM version: <strong>{props.npmVersion}</strong>
			</div>
			<div style={itemStyle}>
				Build version: <strong>{props.buildVersion}</strong>
			</div>
			<div style={itemStyle}>
				Build Target: <strong style={{textTransform: "uppercase"}}>{props.buildTarget}</strong>
			</div>
			<div style={itemStyle}>
				Config Environment: <strong style={{textTransform: "uppercase"}}>{props.configEnv}</strong>
			</div>
			<div style={itemStyle}>
				NODE Environment: <strong style={{textTransform: "uppercase"}}>{props.nodeEnv}</strong>
			</div>
		</div>
	);

	const configCard = (
		<div style={configStyle}>
			<div style={titleStyle}>
				Application Configuration
			</div>
			{Object.keys(props.config).map(item => (
				<div key={item} style={itemStyle}>
					{item}: <strong>{props.config[ item ]}</strong>
				</div>
			))}
		</div>
	);

	return (
		<div style={wrapperStyle}>
			{showVersionCard ? versionCard : null}
			{showConfigCard ? configCard : null}
		</div>
	);
}
