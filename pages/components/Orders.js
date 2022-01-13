import { Card, Heading, RadioButton, Stack } from "@shopify/polaris";
import React, { useCallback, useState } from "react";

function Orders() {
  const [radioValue, setRadioValue] = useState("disabled");
  //Radio Form Config
  const handleChange = useCallback(
    (_checked, newValue) => setRadioValue(newValue),
    []
  );

  // RadioButton Content
  const radioButtonList = (
    <div>
      <Card>
        <Card.Section>
          <div className="second-tabContent">
            <div className="second-tabContent--header ">
              <Heading>フォーマット選択</Heading>
            </div>
            <Stack vertical>
              <RadioButton
                label="佐川急便 - e飛伝II"
                checked={radioValue === "1"}
                id="1"
                name="accounts"
                onChange={handleChange}
              />
              <RadioButton
                label="佐川急便 - e飛伝III"
                id="2"
                name="accounts"
                checked={radioValue === "2"}
                onChange={handleChange}
              />
              <RadioButton
                label="ヤマト B2 運輸 - クラウド"
                id="3"
                name="accounts"
                checked={radioValue === "3"}
                onChange={handleChange}
              />
              <RadioButton
                label="日本郵政 - ゆうパックプリントR"
                id="4"
                name="accounts"
                checked={radioValue === "4"}
                onChange={handleChange}
              />
              <RadioButton
                label="フォーマット未選択"
                id="5"
                name="accounts"
                checked={radioValue === "5"}
                onChange={handleChange}
              />
            </Stack>
          </div>
        </Card.Section>
      </Card>
      <div className="tabOne-text">
        <p>
          フォーマットを変更すると下の「カラムカスタマイズ」の項目が変わります。
        </p>
        <p>
          カラムの内容を編集されていた場合、元に戻すことは出来ませんのでご注意ください。
        </p>
      </div>
    </div>
  );

  return <div>{radioButtonList}</div>;
}

export default Orders;
