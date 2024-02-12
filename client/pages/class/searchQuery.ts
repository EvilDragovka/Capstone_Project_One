class SearchQuery {
    private prompt: string;
    private result: string;

    constructor(prompt: string, result: string) {
        this.prompt = prompt;
        this.result = result;
    }

    public getPrompt(): string {
        return this.prompt;
    }

    public getResult(): string {
        return this.result;
    }
}

export default SearchQuery;