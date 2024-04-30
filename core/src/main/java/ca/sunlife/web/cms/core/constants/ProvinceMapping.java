package ca.sunlife.web.cms.core.constants;
public enum ProvinceMapping {
    ALBERTA("Alberta", "Alberta"),
    BRITISH_COLUMBIA("British Columbia", "Colombie-Britannique"),
    MANITOBA("Manitoba", "Manitoba"),
    NEW_BRUNSWICK("New Brunswick", "Nouveau-Brunswick"),
    NEWFOUNDLAND_AND_LABRADOR("Newfoundland and Labrador", "Terre-Neuve-et-Labrador"),
    NOVA_SCOTIA("Nova Scotia", "Nouvelle-Écosse"),
    ONTARIO("Ontario", "Ontario"),
    PRINCE_EDWARD_ISLAND("Prince Edward Island", "Île-du-Prince-Édouard"),
    QUEBEC("Quebec", "Québec"),
    SASKATCHEWAN("Saskatchewan", "Saskatchewan"),
    NUNAVUT("Nunavut", "Nunavut"),
    NORTHWEST_TERRITORIES("Northwest Territories","Territoires du Nord-Ouest"),
    YUKON("Yukon","Yukon");

    private final String englishName;
    private final String frenchName;

    // Constructor
    ProvinceMapping(String englishName, String frenchName) {
        this.englishName = englishName;
        this.frenchName = frenchName;
    }

    // Getters
    public String getEnglishName() {
        return englishName;
    }

    public String getFrenchName() {
        return frenchName;
    }

    // Method to get French name from English name
    public static String getFrenchNameFromEnglish(String englishName) {
        for (ProvinceMapping province : values()) {
            if (province.getEnglishName().equals(englishName)) {
                return province.getFrenchName();
            }
        }
        return null; // Return null if not found
    }
}
