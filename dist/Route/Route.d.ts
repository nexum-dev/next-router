import { RouteMatch } from '../types';
declare class Route {
    private page;
    private keys;
    private compiled;
    private regex;
    constructor(pattern: string, page: string);
    private valuesToParams;
    match(asPath: string): RouteMatch;
    assemble(params: any): string;
    getPage(): string;
}
export default Route;
