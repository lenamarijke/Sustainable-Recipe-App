export class SavedRecipe {
    constructor(
        public id: string,
        public title: string,
        public score: string,
        public scoreInfo: string,
        public ingredients: string[],
        public instructions: string,
        public imageUrl: string,
        public description: string,
        ) {}
}
