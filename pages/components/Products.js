import {
  Card,
  DataTable,
  Heading,
  RadioButton,
  Stack,
  TextField,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { CSVLink } from "react-csv";

function Products({ authAxios }) {
  const [products, setProducts] = useState([]);
  const [productFilename, setProductFilename] = useState("product");
  const [radioValue, setRadioValue] = useState("disabled");

  const productHeadersTwo = [
    { label: "id", key: "id" },
    { label: "title", key: "title" },
    { label: "body_html", key: "body_html" },
    { label: "vendor", key: "vendor" },
    { label: "product_type", key: "product_type" },
    { label: "created_at", key: "created_at" },
    { label: "handle", key: "handle" },
    { label: "updated_at", key: "updated_at" },
    { label: "published_at", key: "published_at" },
    { label: "template_suffix", key: "template_suffix" },
    { label: "status", key: "status" },
    { label: "published_scope", key: "published_scope" },
    { label: "tags", key: "tags" },
    { label: "admin_graphql_api_id", key: "admin_graphql_api_id" },
    { label: "image", key: "image" },
    { label: "options", key: "options" },
    { label: "variants", key: "variants" },
    { label: "images", key: "images" },
  ];
  const [newProductHeaders, setNewProductHeaders] = useState(productHeadersTwo);
  const csvName = productFilename + ".csv";

  useEffect(() => {
    // Fetch Products
    authAxios.get("/products").then((result) => {
      if (result !== undefined) {
        setProducts(result.data);
      }
    });
  }, [authAxios]);

  const productArray = products.map((product) => {
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
      image: product.image.toString(),
      options: product.options.join(),
      variants: product.variants.join(),
      images: product.images.join(),
    };
  });

  let sortedHeader = [];

  // Push newProductHeader Keys
  newProductHeaders.map((head) => {
    return sortedHeader.push(head.key);
  });

  // Sort Product Data
  const sortedProducts = productArray.map((product) => {
    return JSON.parse(JSON.stringify(product, sortedHeader));
  });

  // Product Table Rows
  const prodRow = sortedProducts.map((p) => {
    return Object.values(p);
  });

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
            headings={sortedHeader}
            rows={prodRow}
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
  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(newProductHeaders);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNewProductHeaders(items);
  }

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
      </Card>
    </div>
  );

  // FileName Change Callback
  const fileNameChange = useCallback(
    (newValue) => setProductFilename(newValue),
    []
  );

  // Rename file
  const filenameForm = (
    <div className="rename-form">
      <Card>
        <Card.Section>
          <div className="txtbox">
            <TextField
              label="Rename File"
              value={productFilename}
              onChange={fileNameChange}
              autoComplete="off"
              className="txtbox--txtfield"
              placeholder={"product.csv"}
            />
          </div>
          <div className="tbl-btn-grp">
            <CSVLink
              headers={newProductHeaders}
              data={sortedProducts}
              filename={productFilename + ".csv"}
              className="tbl-btn-grp--csv-button"
              onClick={saveHistory}
            >
              Download CSV
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
