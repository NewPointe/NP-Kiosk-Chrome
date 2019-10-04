
export function mergeLabelContent(labelContent: string, mergeFields: Record<string, string>): string {

    for (const [key, value] of Object.entries(mergeFields)) {
        if (value.length > 0) {

            // merge the contents of the field
            labelContent = labelContent.replace(new RegExp(`(?<=\\^FD)(${key})(?=\\^FS)`), value);

        }
        else {

            // remove the field origin (used for inverting backgrounds)
            labelContent = labelContent.replace(new RegExp(`\\^FO.*\\^FS\\s*(?=\\^FT.*\\^FD${key}\\^FS)`), "");

            // remove the field data (the actual value)
            labelContent = labelContent.replace(new RegExp(`\\^FD${key}\\^FS`), "");

        }
    }

    return labelContent;

}
