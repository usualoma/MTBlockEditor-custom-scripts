import "./style.css";

const mtDataApiUrl = document.querySelector("[data-mt-data-api-url]").dataset
  .mtDataApiUrl;
init();

function init() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  const button = document.createElement("button");
  button.type = "button";
  button.innerText = "検索";
  button.addEventListener("click", () => search({ term: input.value }));

  form.appendChild(input);
  form.appendChild(button);

  document.body.appendChild(form);
}

async function search({ term }) {
  const selectId = "published_entries_select";

  const oldSelect = document.querySelector(`#${selectId}`);
  if (oldSelect) {
    oldSelect.remove();
  }

  const params = new URLSearchParams();
  params.set("search", term);

  const res = await fetch(`${mtDataApiUrl}/v4/search?${params.toString()}`);
  const data = await res.json();

  const select = document.createElement("select");
  select.id = selectId;

  const blank = document.createElement("option");
  blank.innerText = "選択してください";
  select.appendChild(blank);

  data.items.forEach((item) => {
    const option = document.createElement("option");
    option.innerText = item.title;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    if (!select.selectedIndex) {
      MTBlockEditorSetCompiledHtml("");
      return;
    }

    const item = data.items[select.selectedIndex - 1];
    const anchor = document.createElement("a");
    anchor.href = item.permalink;
    anchor.innerText = item.title;
    MTBlockEditorSetCompiledHtml(anchor.outerHTML);
  });

  document.body.appendChild(select);
}
