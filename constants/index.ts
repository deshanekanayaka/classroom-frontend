export const DEPARTMENTS = [
    'CS',
    'Javascript',
    'React',
]
// Map over the list so it can be displayed as a list in dropdown

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
}))