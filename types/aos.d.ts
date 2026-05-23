declare module 'aos' {
  interface AosOptions {
    /** Animation duration in milliseconds */
    duration?: number;
    /** Whether animation should happen only once */
    once?: boolean;
    /** Whether elements should animate out while scrolling down */
    mirror?: boolean;
    /** Delay before animation starts */
    delay?: number;
    /** Animation easing function */
    easing?: string;
    /** Additional settings */
    [key: string]: any;
  }

  interface AosInstance {
    /**
     * Initialize AOS
     * @param options AOS initialization options
     */
    init(options?: AosOptions): void;
    
    /**
     * Refresh all AOS animations
     */
    refresh(): void;
    
    /**
     * Hard refresh all AOS animations
     */
    refreshHard(): void;
  }

  const aos: AosInstance;
  export default aos;
}
