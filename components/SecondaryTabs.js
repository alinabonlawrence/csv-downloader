import {
  Card,
  Heading,
  Page,
  RadioButton,
  Stack,
  Tabs,
} from "@shopify/polaris";
import React, { useCallback, useState } from "react";

function SecondaryTabs() {
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
  // End of Initial Tab Config

  //Radio Form Config
  const [value, setValue] = useState("disabled");

  console.log(value);
  const handleChange = useCallback(
    (_checked, newValue) => setValue(newValue),
    []
  );
  // End of Radio Config

  // RadioButton Content
  const radioButtonList = (
    <div>
      <div className="second-tabContent">
        <div className="second-tabContent--header ">
          <Heading>フォーマット選択</Heading>
        </div>
        <Stack vertical>
          <RadioButton
            label="佐川急便 - e飛伝II"
            checked={value === "1"}
            id="1"
            name="accounts"
            onChange={handleChange}
          />
          <RadioButton
            label="佐川急便 - e飛伝III"
            id="2"
            name="accounts"
            checked={value === "2"}
            onChange={handleChange}
          />
          <RadioButton
            label="ヤマト B2 運輸 - クラウド"
            id="3"
            name="accounts"
            checked={value === "3"}
            onChange={handleChange}
          />
          <RadioButton
            label="日本郵政 - ゆうパックプリントR"
            id="4"
            name="accounts"
            checked={value === "4"}
            onChange={handleChange}
          />
          <RadioButton
            label="フォーマット未選択"
            id="5"
            name="accounts"
            checked={value === "5"}
            onChange={handleChange}
          />
        </Stack>
      </div>
    </div>
  );
  // End of RadioContent

  //

  // Tab Body
  let secondaryTabComponent = "";
  let text = "";

  if (selected === 0) {
    secondaryTabComponent = radioButtonList;

    text = (
      <div className="tabOne-text">
        <p>
          フォーマットを変更すると下の「カラムカスタマイズ」の項目が変わります。
        </p>
        <p>
          カラムの内容を編集されていた場合、元に戻すことは出来ませんのでご注意ください。
        </p>
      </div>
    );
  } else if (selected === 1) {
    secondaryTabComponent = (
      <Page>
        <p>Hello Tab 2</p>
      </Page>
    );
  } else if (selected === 2) {
    secondaryTabComponent = (
      <Page>
        <p>Hello Tab 3</p>
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
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          {secondaryTabComponent}
        </Tabs>
      </Card>
      {text}
    </div>
  );
}

export default SecondaryTabs;
