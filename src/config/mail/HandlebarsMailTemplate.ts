import Handlebars from "handlebars";


interface ITemplateVariable {
    [key: string]: string | number;
}

interface IParseMailTemplate {
    template: string;
    variables: ITemplateVariable;
}

export default class HandlebarsMailTemplate {
    public async parse({ template, variables }: IParseMailTemplate) {
        const parseTemplate = Handlebars.compile(template);
        return parseTemplate(variables);
    }
}