import faker from 'faker'

export default () => {
    const nodes = Array(100)
        .fill(null)
        .map(() => ({
            id: faker.random.uuid(),
            latitude: +faker.address.latitude(),
            longitude: +faker.address.longitude(),
        }))

    const allIds = nodes.map(d => d.id)
    const links = allIds.slice(10, 990).map(d => ({
        source: d,
        target: faker.helpers.randomize(allIds),
    }))

    return {
        nodes,
        links,
    }
}
