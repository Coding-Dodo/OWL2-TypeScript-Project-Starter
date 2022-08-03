import { Component, useState, xml, useExternalListener, useRef } from "@odoo/owl";

const AUTO_COMPLETE_INPUT_TEMPLATE = xml/*xml*/ `
<div class="relative" v-click-outside="clickedOutside">
    <input
      t-att-value="props.value ? props.value.name : ''"
      t-model="state.searchTerm"
      t-on-click="handleShowOptions"
      t-on-focus="handleShowOptions"
      t-att-placeholder="props.placeHolder"
      ref="input"
      t-ref="autoCompleteInputRef"
      tabindex="0"
      t-att-class="props.inputClass ? props.inputClass : 'border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:shadow-outline'"
    />
    <span
      t-if="props.value"
      t-on-click.prevent="reset()"
      class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
    >
      x
    </span>
    <div
      t-if="state.showOptions"
      tabindex="0"
      t-att-class="props.dropdownClass ? props.dropdownClass : 'absolute w-full z-50 bg-white border border-gray-300 mt-1 mh-48 overflow-hidden overflow-y-scroll rounded-md shadow-md'"
    >
      <ul class="py-1">
        <li
          t-foreach="searchResults()" t-as="searchResult" t-key="searchResult.name" 
          t-on-click.prevent="() => handleClick.bind(this)(searchResult)"
          class="px-3 py-2 cursor-pointer hover:bg-gray-200"
        >
          <t t-esc="searchResult.name"/>
        </li>
        <li t-if="!searchResults().length" class="px-3 py-2 text-center">
          No Matching Results
        </li>
      </ul>
    </div>
</div>
`;

export class AutoCompleteInput extends Component {
  static template = AUTO_COMPLETE_INPUT_TEMPLATE;
  static props = {
    placeHolder: { type: String, optional: true },
    inputClass: { type: String, optional: true },
    dropdownClass: { type: String, optional: true },
    data: {
      type: Array,
    },
    value: { name: "", optional: true },
  };
  state = useState({
    showOptions: false,
    chosenOption: "",
    searchTerm: "",
  });
  autoCompleteInputRef = useRef("autoCompleteInputRef");

  setup() {
    useExternalListener(window, "click", this.hideOptions);
  }

  hideOptions(event: Event) {
    console.log("hide Options", this.autoCompleteInputRef.el);
    if (!this.autoCompleteInputRef.el?.contains(event.target as Node)) {
      Object.assign(this.state, { showOptions: false });
    }
  }

  reset() {
    // this.trigger("input", "");
    // this.trigger("chosen", { selectedTechnology: null });
    Object.assign(this.state, {
      chosenOption: "",
      searchTerm: "",
      showOptions: false,
    });
  }

  handleShowOptions(evt: Event) {
    if (evt.target instanceof HTMLInputElement) {
      console.log("hello", this.props.data);
      this.state.searchTerm = evt.target.value;
      this.state.showOptions = true;
    }
  }

  searchResults() {
    if (!this.state.searchTerm) {
      return this.props.data;
    }
    return this.props.data.filter((item: { name: string; optional: boolean }) => {
      return item.name.toLowerCase().includes(this.state.searchTerm.toLowerCase());
    });
  }

  handleClick(item: { name: string; optional: boolean }) {
    // this.trigger("input", item.name);
    // this.trigger("chosen", { selectedTechnology: item });
    Object.assign(this.state, {
      chosenOption: item.name,
      showOptions: false,
      searchTerm: item.name,
    });
  }
}
