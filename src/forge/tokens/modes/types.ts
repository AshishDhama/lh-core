/**
 * ModeTokenOverrides — partial token overrides per design mode.
 *
 * All fields are optional. When absent, base Forge tokens apply.
 */
export interface ModeTokenOverrides {
  /** Border radius overrides (CSS pixel strings). */
  radii?: {
    /** Card / container radius. */
    card?: string;
    /** Button radius. */
    button?: string;
    /** Small element radius (badges, tags, etc.). */
    sm?: string;
    /** Input / form control radius. */
    input?: string;
    /** Modal / overlay radius. */
    modal?: string;
  };

  /** Box-shadow overrides. */
  shadows?: {
    /** Card / surface shadow. */
    card?: string;
    /** Elevated button shadow. */
    button?: string;
  };

  /** Card container style overrides. */
  card?: {
    /** Default padding (CSS shorthand). */
    padding?: string;
    /** Border width. */
    borderWidth?: string;
    /** Border style modifier — e.g. left-accent for notion. */
    borderAccent?: 'none' | 'left-teal';
    /** Background override (CSS color). */
    background?: string;
  };

  /** Typography overrides. */
  typography?: {
    /** Primary font family override. */
    fontFamily?: string;
    /** Heading letter-spacing. */
    headingLetterSpacing?: string;
    /** Section label style — "caps" renders uppercase + letter-spacing. */
    sectionLabel?: 'default' | 'caps';
  };

  /** Accent / surface color overrides. */
  colors?: {
    /** Page background (light mode). */
    pageBg?: string;
    /** Secondary / sidebar background (light mode). */
    secondaryBg?: string;
    /** Card background (light mode). */
    cardBg?: string;
    /** Border color (light mode, CSS color). */
    border?: string;
  };
}
