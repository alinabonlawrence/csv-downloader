import {
  Button,
  Card,
  DataTable,
  Heading,
  Icon,
  Label,
  RadioButton,
  Stack,
  TextField,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { CSVLink } from "react-csv";
import { DragHandleMinor, MobileCancelMajor } from "@shopify/polaris-icons";

function Products({ authAxios }) {
  const [products, setProducts] = useState([]);
  const [productFilename, setProductFilename] = useState("");
  const [radioValue, setRadioValue] = useState("disabled");
  const [columnCounter, setColumnCounter] = useState(0);

  const productHeadersTwo = [
    { label: "id", key: "id", isChecked: true },
    { label: "title", key: "title", isChecked: true },
    { label: "body_html", key: "body_html", isChecked: true },
    { label: "vendor", key: "vendor", isChecked: true },
    { label: "product_type", key: "product_type", isChecked: true },
    { label: "created_at", key: "created_at", isChecked: true },
    { label: "handle", key: "handle", isChecked: true },
    { label: "updated_at", key: "updated_at", isChecked: true },
    { label: "published_at", key: "published_at", isChecked: true },
    { label: "template_suffix", key: "template_suffix", isChecked: true },
    { label: "status", key: "status", isChecked: true },
    { label: "published_scope", key: "published_scope", isChecked: true },
    { label: "tags", key: "tags", isChecked: true },
    {
      label: "admin_graphql_api_id",
      key: "admin_graphql_api_id",
      isChecked: true,
    },
    { label: "image", key: "image", isChecked: true },
    { label: "options", key: "options", isChecked: true },
    { label: "variants", key: "variants", isChecked: true },
    { label: "images", key: "images", isChecked: true },
  ];
  const [newProductHeaders, setNewProductHeaders] = useState(productHeadersTwo);
  const csvName =
    productFilename !== "" ? productFilename + ".csv" : "product.csv";

  useEffect(() => {
    // Fetch Products
    authAxios.get("/products").then((result) => {
      if (result !== undefined) {
        setProducts(result.data);
      }
    });
  }, [authAxios]);

  const productArray = products.map((product) => {
    let imageData = product.images
      .map((i) => {
        let data = [];
        for (const [key, value] of Object.entries(i)) {
          data.push(`${key} : ${value}`);
        }
        return data;
      })
      .join();

    let optionsData = product.options
      .map((o) => {
        let data = [];
        for (const [key, value] of Object.entries(o)) {
          data.push(`${key} : ${value}`);
        }
        return data;
      })
      .join();

    let variantsData = product.variants
      .map((v) => {
        let data = [];
        for (const [key, value] of Object.entries(v)) {
          data.push(`${key} : ${value}`);
        }
        return data;
      })
      .join();

    let imagesData = product.images
      .map((i) => {
        let data = [];
        for (const [key, value] of Object.entries(i)) {
          data.push(`${key} : ${value}`);
        }
        return data;
      })
      .join();

    return {
      id: product.id,
      title: product.title,
      body_html: product.body_html,
      vendor: product.vendor,
      product_type: product.product_type,
      created_at: product.created_at,
      handle: product.handle,
      updated_at: product.updated_at,
      published_at: product.published_at,
      template_suffix: product.template_suffix,
      status: product.status,
      published_scope: product.published_scope,
      tags: product.tags,
      admin_graphql_api_id: product.admin_graphql_api_id,
      image: imageData,
      options: optionsData,
      variants: variantsData,
      images: imagesData,
    };
  });

  // Get newProductHeader Keys
  const sortedHeader = newProductHeaders.map((head) => head.key);

  // Sort Product Data
  const sortedProducts = productArray.map((product) => {
    return JSON.parse(JSON.stringify(product, sortedHeader));
  });

  // Product Table Rows
  const productRows = sortedProducts.map((p) => {
    return Object.values(p);
  });

  // Get Sorted Renamed Headers
  const sortedRenamedHeaders = newProductHeaders.map((head) => head.label);

  // Product Table
  const productTable = (
    <div className="prod-table">
      <Card>
        <Card.Section>
          <DataTable
            columnContentTypes={[
              "numeric",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
            ]}
            headings={sortedRenamedHeaders}
            rows={productRows}
          />
        </Card.Section>
      </Card>
    </div>
  );

  // Post csv Download history to DB
  const saveHistory = async () => {
    authAxios
      .post("/export-history", {
        export_name: csvName,
      })
      .then((result) => {
        if (result !== undefined) {
          console.log(result);
        }
      });
  };

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

  //  Drag N Drop Drag Function
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(newProductHeaders);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNewProductHeaders(items);
  };

  // Rename Header Function
  const renameHeader = (header, value) => {
    const items = newProductHeaders.map((obj) => {
      if (obj.key === header.key) {
        return { ...obj, label: value };
      }
      return obj;
    });
    setNewProductHeaders(items);
  };

  // Add new column
  const addNewColumn = () => {
    const newColumn = { label: "New Column", key: `newColumn${columnCounter}` };
    setColumnCounter(columnCounter + 1);
    return productHeadersTwo.push(newColumn);
  };

  console.log(newProductHeaders);

  // Drag N Drop
  const dragNDrop = (
    <div className="tbl-content">
      <div className="second-tabContent--header ">
        <Heading>カラムカスタマイズ</Heading>
      </div>
      <Card>
        <Card.Section>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="product">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="header-table"
                >
                  {newProductHeaders.map((header, index) => {
                    return (
                      <Draggable
                        key={header.key}
                        draggableId={header.key}
                        index={index}
                        ref={provided.innerRef}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="header-table--list"
                          >
                            <div className="table-card">
                              <Icon source={DragHandleMinor} color="base" />
                              <div className="table-card--row">
                                <div className="header-name">{header.key}</div>
                              </div>
                              <div className="table-card--row">
                                <input
                                  type="text"
                                  className="header-input"
                                  value={header.label}
                                  placeholder={header.label}
                                  onChange={(e) =>
                                    renameHeader(header, e.target.value)
                                  }
                                />
                              </div>
                              <button className="delete-header">
                                <Icon source={MobileCancelMajor} color="base" />
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </Card.Section>
        <div className="tbl-btn-grp">
          <button className="tbl-btn-grp--add-button">空カラムを追加</button>
          <button className="tbl-btn-grp--csv-button" onClick={addNewColumn}>
            新しいカラムを追加
          </button>
        </div>
      </Card>
    </div>
  );

  // FileName Change Callback
  const fileNameChange = useCallback(
    (newValue) => setProductFilename(newValue),
    []
  );
  //Radio Form Config
  const handleChange2 = useCallback(
    (_checked, newValue) => setRadioValue(newValue),
    []
  );

  // Rename file
  const filenameForm = (
    <div className="rename-form">
      <div className="second-tabContent--header ">
        <Heading>オプション</Heading>
      </div>
      <Card>
        <Card.Section>
          <div className="txtbox1">
            <label className="txtbox1--label">ファイル名</label>
            <TextField
              value={productFilename}
              onChange={fileNameChange}
              autoComplete="off"
              className="txtbox1--txtfield"
              placeholder={"export_YYMMDD"}
            />
          </div>
          <div className="txtbox2">
            <label className="txtbox2--label">ヘッダー行</label>
            <span className="txtbox2--radio-btn">
              <RadioButton
                label="ヘッダー行を出力する"
                checked={radioValue === "ヘッダー行を出力する"}
                id="ヘッダー行を出力する"
                name="accounts"
                className="radio"
                onChange={handleChange}
              />
              <RadioButton
                label="ヘッダー行を出力しない"
                checked={radioValue === "ヘッダー行を出力しない"}
                id="ヘッダー行を出力しない"
                name="accounts"
                className="radio"
                onChange={handleChange}
              />
            </span>
          </div>

          <div className="tbl-btn-grp">
            <button className="tbl-btn-grp--add-button">この内容を保存</button>
            <CSVLink
              headers={newProductHeaders}
              data={sortedProducts}
              filename={csvName}
              onClick={saveHistory}
            >
              <button className="tbl-btn-grp--csv-button" onClick={saveHistory}>
                エクスポート
              </button>
            </CSVLink>
          </div>
        </Card.Section>
      </Card>
    </div>
  );

  return (
    <div>
      {radioButtonList}
      {dragNDrop}
      {/* {productTable} */}
      {filenameForm}
    </div>
  );
}

export default Products;
