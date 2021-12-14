import { Button, Heading, Page, Tabs } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import SecondaryTabs from "../components/SecondaryTabs";

function index({ authAxios }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    authAxios.get("/products").then((result) => {
      if (result !== undefined) {
        console.log(result.body);
      }
    });
  }, []);

  console.log(products);

  // Initial Tab Config - Polaris
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "tab-1",
      content: (
        <Button>
          <span className="text-bold">ホーム</span>
        </Button>
      ),
    },
    {
      id: "tab-2",
      content: (
        <Button>
          <span className="text-bold">依頼主設定(伝票)</span>
        </Button>
      ),
    },
    {
      id: "tab-3",
      content: (
        <Button>
          <span className="text-bold">ヘッダー名変更</span>
        </Button>
      ),
    },
    {
      id: "tab-4",
      content: (
        <Button>
          <span className="text-bold">プラン情報</span>
        </Button>
      ),
    },
  ];
  // End of Initial Tab Config

  // Tab Body
  let primaryTabComponent = "";

  if (selected === 0) {
    primaryTabComponent = (
      <div className="tabContent">
        <div className="tabContent--header">
          <Heading>フォーマット選択</Heading>
        </div>
        <SecondaryTabs />
      </div>
    );
  } else if (selected === 1) {
    primaryTabComponent = (
      <Page>
        <p>Hello Tab 2</p>
      </Page>
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
