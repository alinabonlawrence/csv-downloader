import { Button, Card, Page, Tabs } from "@shopify/polaris";
import React, { useCallback, useState } from "react";

function index() {
  // Initial Tab Config - Polaris
  const [selected, setSelected] = useState(0);
  const [panel, setPanel] = useState("");

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "tab-1",
      content: <Button>ホーム</Button>,
      accessibilityLabel: "All customers",
      panelID: "{panel1}",
    },
    {
      id: "tab-2",
      content: <Button>依頼主設定(伝票)</Button>,
      panelID: "panel-2",
    },
    {
      id: "tab-3",
      content: <Button>ヘッダー名変更</Button>,
      panelID: "repeat-customers-content-1",
    },
    {
      id: "tab-4",
      content: <Button>プラン情報</Button>,
      panelID: "prospects-content-1",
    },
  ];
  // End of Initial Tab Config

  // const tabPanels = [
  //   <Tabs.Panel id="panel-1">
  //     <p>Hello 1</p>
  //   </Tabs.Panel>,
  //   <Tabs.Panel id="panel-2">
  //     <p>Hello 2</p>
  //   </Tabs.Panel>,
  // ];

  const panel1 = (
    <Tabs.Panel id="panel1">
      <p>Hello 1</p>
    </Tabs.Panel>
  );

  return (
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      <Card>{tabs[selected].panelID}</Card>
    </Tabs>
  );
}

export default index;
