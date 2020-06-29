import RightDataPanel from "../components/data-panel/RightDataPanel";
import LeftDataPanel from "../components/data-panel/LeftDataPanel";
import SplitPane from "react-split-pane";
import Sidebar from "react-sidebar";
import ControlPanel from '../components/control-panel/ControlPanel';
import Header from '../components/header/Header';

import { useRecoilState } from "recoil";
import { applicationState } from "../store/atoms";

import knex from "knex";
import { useEffect, useState } from "react";

export default function Matcher({ left_rows, right_rows }) {
  const [appState, setAppState] = useRecoilState(applicationState);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  });

	function setSidebarOpen(open) {
		setAppState({
			...appState,
			sidebarOpen: open,
		});
	}

	return (
		<Sidebar
			sidebar={<ControlPanel />}
			open={appState.sidebarOpen}
			onSetOpen={() => setSidebarOpen(false)}
			styles={{ sidebar: { background: "white" } }}
		>
			<Header />
			<div>
				<div className="Main">
					<button
						style={{ position: "absolute", zIndex: 1 }}
						onClick={() => setSidebarOpen(true)}
					>
						Sort/Filter
					</button>

					<div className="Body">
						<SplitPane
							split="vertical"
							minSize={400}
							defaultSize={Math.round(windowWidth / 2)}
							style={{ overflow: "auto" }}
						>
							<LeftDataPanel data={left_rows} />
							<RightDataPanel data={right_rows} />
						</SplitPane>
					</div>
				</div>
			</div>
		</Sidebar>
	);
}

export async function getServerSideProps(context) {
  const db = knex({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING
  });

  const left_rows = await db.table("main_healthcareworker").select().then(rows => rows.map(row => ({...row, submitted_at: String(row.submitted_at)})));
  const right_rows = await db.table("main_volunteer").select().then(rows => rows.map(row => ({...row, submitted_at: String(row.submitted_at)})));

  return {
    props: { left_rows, right_rows }, // will be passed to the page component as props
  }
}