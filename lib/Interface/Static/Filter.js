import J3Object from "../J3Object";
class Filter {
    static filter(filter, selector, context) {
        const found_nodes = J3Object.find(selector, context);
        return found_nodes.filter((node) => {
            return filter.indexOf(node) !== -1;
        });
    }
}
export default Filter;
