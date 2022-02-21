export interface Attributes {
        name: string;
        type: string;
        value: string;
        required: boolean;
        disabled: boolean;
        node_type: string;
    }

    export interface Label {
        id: number;
        text: string;
        type: string;
    }

    export interface Meta {
        label: Label;
    }

    interface OryMessage {
      context: {
        reason: string,
      }
      id: number,
      text: string,
      type: string
    }
    export interface Node {
        type: string;
        group: string;
        attributes: Attributes;
        messages: OryMessage[];
        meta: Meta;
    }

    export interface Ui {
        action: string;
        method: string;
        nodes: Node[];
        messages: OryMessage[]
    }

    export interface Flow {
        id: string;
        type: string;
        expires_at: string;
        issued_at: string;
        request_url: string;
        ui: Ui;
        state: string;
    }


export const InitFlow: Flow = {
   id: "",
   type: "",
   expires_at: "",
   issued_at: "",
   request_url: "",
   ui: {
     nodes: [],
     action: "",
     method: "",
     messages: []
   },
   state: ""
}
