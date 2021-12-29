import { Heading, Page, Tabs } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import History from "./components/History";
import SecondaryTabs from "./components/SecondaryTabs";

function index({ authAxios }) {
  // Initial Tab Config - Polaris
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "tab-1",
      content: <div className="text-bold">ホーム</div>,
    },
    {
      id: "tab-2",
      content: <div className="text-bold">依頼主設定(伝票)</div>,
    },
    {
      id: "tab-3",
      content: <div className="text-bold">ヘッダー名変更</div>,
    },
    {
      id: "tab-4",
      content: <div className="text-bold">プラン情報</div>,
    },
  ];
  // End of Initial Tab Config

  // Tab Body
  let primaryTabComponent = "";

  if (selected === 0) {
    primaryTabComponent = (
      <div className="tabContent">
        <History authAxios={authAxios} />
      </div>
    );
  } else if (selected === 1) {
    primaryTabComponent = (
      <div className="tabContent">
        <div className="tabContent--header">
          <Heading>フォーマット選択</Heading>
        </div>
        <SecondaryTabs authAxios={authAxios} />
      </div>
    );
  } else if (selected === 2) {
    primaryTabComponent = (
      <Page>
        <p>Hello Tab 3</p>
      </Page>
    );
  } else if (selected === 3) {
    primaryTabComponent = (
      <Page>
        <p>Hello Tab 4</p>
      </Page>
    );
  }

  //End of Tab Body

  return (
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      {primaryTabComponent}
    </Tabs>
  );
}

export default index;
