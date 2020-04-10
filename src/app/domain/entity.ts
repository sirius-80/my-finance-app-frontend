/**
 * Common superclass for all domain events.
 */
export interface DomainEvent {
}

/**
 * Superclass of all Entities (as in Domain Driven Design Entities). Entities may have domain events registered
 * on them. These events need to be published by the infrastructure when the Entity is persisted (e.g. to the
 * database).
 */
export class Entity {
    private domainEvents: DomainEvent[] = [];
    
    constructor(private entityId: string) {}

    /**
     * Registers (adds) a new domain event on this entity. Domain events will be dispatched by the infrastructure
     * when the entity is persisted.
     * 
     * See 2-step account_management-event publishing:
     *   https://paucls.wordpress.com/2018/05/31/ddd-aggregate-roots-and-domain-events-publication/
     * @param event 
     */
    registerDomainEvent(event: DomainEvent): void {
        this.domainEvents.push(event);
    }

    /**
     * Returns the list of account_management events and clears the list of registered events on this Aggregate Root.
     * This method is typically called by the infrastructure, which is responsible for actually publishing
     * the registered events.
     * See 2-step account_management-event publishing:
     *   https://paucls.wordpress.com/2018/05/31/ddd-aggregate-roots-and-domain-events-publication/
     */
    flushDomainEvents(): DomainEvent[] {
        const copy = this.domainEvents;
        this.domainEvents = [];
        return copy;
    }
}
