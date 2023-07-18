
/**
 * An incident is an event during an operation.
 * For example, an accident (incident) during a marathon (operation)
 */
export interface Incident {
    
    id: string;
    /**
     * Name of the incident
     */
    name: string;
    /**
     * Description of the incident
     */
    description: string;
    /**
     * Operation ID the incident is assigned to
     */
    operation: string;
    /**
     * Is incident completed?
     */
    isCompleted: boolean;
}

/**
 * Used to create an {@link Incident}
 */
export interface CreateIncident {
    /**
     * Name of the incident
     */
    name: string;
    /**
     * Description of the incident
     */
    description: string;
    /**
     * Operation ID the incident is assigned to
     */
    operation: string;
    /**
     * Is incident completed?
     */
    isCompleted: boolean;
}