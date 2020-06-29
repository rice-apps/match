import "../components/control-panel/ControlPanel.css";
import "../components/header/Header.css";
import "../components/loader/Loader.css";
import "../components/table/Table.css";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

import { RecoilRoot } from "recoil";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
	return (
		<RecoilRoot>
            <Component {...pageProps} />
		</RecoilRoot>
	);
}
