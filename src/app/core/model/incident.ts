
/**
 * An incident is an event during an operation.
 * For example, an accident (incident) during a marathon (operation)
 */
export interface Incident {
    id: string;
    name: string;
    description: string;
    isCompleted: boolean;
}

/**
 * Used to create an {@link Incident}
 */
export interface CreateIncident {
    name: string;
    description: string;
    isCompleted: boolean;
}