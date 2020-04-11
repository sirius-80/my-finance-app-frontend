import { Entity } from '../entity';
import { v4 as uuid4 } from 'uuid';

export class Category extends Entity {
    private children: Category[] = [];

    constructor(public id: string, public name: string, public parent: Category = null) {
        super(id);
    }


    getQualifiedName(): string {
        let qname: string;
        if (this.parent) {
            qname = this.parent.getQualifiedName() + '::';
        } else {
            qname = '';
        }
        return qname + this.name;
    }

    /**
     * Returns True if given other_category is an ancestor of this category. Returns False otherwise.
     */
    inheritsFrom(otherCategory: Category): boolean {
        if (this.parent) {
            if (this.parent.getQualifiedName() === otherCategory.getQualifiedName()) {
                return true;
            } else {
                return this.parent.inheritsFrom(otherCategory);
            }
        } else {
            return false;
        }
    }
}


/**
 * Abstract class. Override with specific infrastructure.
 */
export interface CategoryRepository {
    getCategories(): Category[];

    getCategory(categoryId: string): Category;

    getCategoryByQualifiedName(qualifiedName: string): Category;

    saveCategory(category: Category): Category;
}

/**
 * Factory to create new Category entities. Note that the caller is responsible to save the created
 * instances using the CategoryRepository.
 */
export class CategoryFactory {
    constructor(private repository: CategoryRepository) { }

    createCategory(name: string, parent: Category = null): Category {
        return new Category(uuid4(), name, parent && this.repository.getCategoryByQualifiedName(parent.getQualifiedName()) || null);
    }

    createCategoryFromQualifiedName(qualifiedName: string): Category {
        let category = null;
        let nextParent = null;
        for (const name of qualifiedName.split('::')) {
            const tmpCategory = this.createCategory(name, nextParent);
            category = this.repository.getCategoryByQualifiedName(tmpCategory.getQualifiedName()) || tmpCategory;
            category.parent = nextParent;
            nextParent = category;
        }
        return category;
    }
}
