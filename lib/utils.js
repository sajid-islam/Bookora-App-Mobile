export const FormattedDate = (isoDate) => {
    const date = new Date(isoDate);
    const formatted = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
    }).format(date);
    return formatted;
};
