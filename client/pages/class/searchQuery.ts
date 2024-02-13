class SearchQuery {
    private prompt: string | null;
    private result: string | null;

    constructor(prompt: string | null, result: string | null) {
        this.prompt = prompt;
        this.result = result;
    }

    public getPrompt(): string | null {
        return this.prompt;
    }

    public getResult(): string | null {
        return this.result;
    }
}

export default SearchQuery;