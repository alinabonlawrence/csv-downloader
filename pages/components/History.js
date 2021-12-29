import { Card, DataTable, Heading } from "@shopify/polaris";
import React from "react";
import { useEffect, useState } from "react";

function History({ authAxios }) {
  const [fileHistory, setFileHistory] = useState([]);
  useEffect(() => {
    authAxios.get("/get-history").then((result) => {
      if (result) {
        setFileHistory(result.data.body);
      }
    });
  }, []);

  const historyRow = fileHistory.map((history) => {
    return [history.export_name, history.export_date];
  });

  const historyHeaders = ["エクスポート名", "エクスポート日"];

  return (
    <div className="tbl-content">
      <div className="second-tabContent--header ">
        <Heading>エクスポート履歴</Heading>
      </div>
      <Card>
        <Card.Section>
          <div className="tbl-content--tbl">
            <DataTable
              columnContentTypes={["text", "text"]}
              headings={historyHeaders}
              rows={historyRow}
            />
          </div>
        </Card.Section>
      </Card>
    </div>
  );
}

export default History;
