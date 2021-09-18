const commonFields = {
    customData: { type: Object, default: () => { } },
    createdDate: { type: Date, default: () => new Date() },
    updatedDate: { type: Date, default: () => new Date() }
}

module.exports = {
    commonFields,
}