import { Card, Page, Tabs } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import Products from "./Products";

function SecondaryTabs({ authAxios }) {
  // Tag Config
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "tab-1",
      content: <span className="text-bold">配送/注文</span>,
    },
    {
      id: "tab-2",
      content: <span className="text-bold">商品</span>,
    },
    {
      id: "tab-3",
      content: <span className="text-bold">会員</span>,
    },
    {
      id: "tab-4",
      content: <span className="text-bold">財務レポート</span>,
    },
  ];

  // Tab Body
  let secondaryTabComponent = "";
  let text = "";
  let productTables = "";

  if (selected === 0) {
    secondaryTabComponent = (
      <Page>
        <p>Hello Tab Orders</p>
      </Page>
    );
  } else if (selected === 1) {
    secondaryTabComponent = <Products authAxios={authAxios} />;
  } else if (selected === 2) {
    secondaryTabComponent = (
      <Page>
        <p>Hello Tab Customers</p>
      </Page>
    );
  } else if (selected === 3) {
    secondaryTabComponent = (
      <Page>
        <p>Hello Tab 4</p>
      </Page>
    );
  }
  //End of Tab Body

  return (
    <div>
      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}></Tabs>
      </Card>
      {secondaryTabComponent}
      {/* {text}
      {productTables} */}
    </div>
  );
}

export default SecondaryTabs;
