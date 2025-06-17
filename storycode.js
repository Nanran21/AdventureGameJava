
import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

/**
 * Interactive Adventure Story Game
 * 
 * A text-based adventure game that allows players to make choices
 * that affect the story progression and lead to different outcomes.
 * Features a branching narrative structure with multiple paths and endings.
 */
public class InteractiveStoryGame {
    
    private Scanner scanner;
    private Map<String, StoryNode> storyNodes;
    private String currentNodeId;
    
    public InteractiveStoryGame() {
        this.scanner = new Scanner(System.in);
        this.storyNodes = new HashMap<>();
        this.currentNodeId = "start";
        initializeStory();
    }
    
    public static void main(String[] args) {
        InteractiveStoryGame game = new InteractiveStoryGame();
        game.startGame();
    }
    
    public void startGame() {
        System.out.println("=".repeat(60));
        System.out.println("      WELCOME TO THE ENCHANTED FOREST ADVENTURE");
        System.out.println("=".repeat(60));
        System.out.println("Your choices will determine your fate in this magical world...");
        System.out.println();
        
        boolean playAgain = true;
        
        while (playAgain) {
            playStory();
            playAgain = askToPlayAgain();
            if (playAgain) {
                currentNodeId = "start";
                System.out.println("\n" + "=".repeat(60));
                System.out.println("Starting a new adventure...");
                System.out.println("=".repeat(60));
            }
        }
        
        System.out.println("\nThank you for playing! May your real adventures be as exciting!");
        scanner.close();
    }
    
    private void playStory() {
        while (currentNodeId != null) {
            StoryNode currentNode = storyNodes.get(currentNodeId);
            if (currentNode == null) {
                System.out.println("Error: Story path not found. Game ending.");
                break;
            }
            
            displayStoryText(currentNode.getText());
            
            if (currentNode.isEndNode()) {
                displayEnding(currentNode.getEndingType());
                break;
            }
            
            currentNodeId = handleChoice(currentNode);
        }
    }
    
    private void displayStoryText(String text) {
        System.out.println();
        System.out.println("-".repeat(50));
        // Word wrap the text for better readability
        String[] words = text.split(" ");
        StringBuilder line = new StringBuilder();
        
        for (String word : words) {
            if (line.length() + word.length() + 1 > 70) {
                System.out.println(line.toString());
                line = new StringBuilder(word);
            } else {
                if (line.length() > 0) line.append(" ");
                line.append(word);
            }
        }
        if (line.length() > 0) {
            System.out.println(line.toString());
        }
        System.out.println("-".repeat(50));
    }
    
    private String handleChoice(StoryNode node) {
        Map<Integer, Choice> choices = node.getChoices();
        
        System.out.println("\nWhat do you choose?");
        for (Map.Entry<Integer, Choice> entry : choices.entrySet()) {
            System.out.println(entry.getKey() + ". " + entry.getValue().getText());
        }
        
        while (true) {
            System.out.print("\nEnter your choice (1-" + choices.size() + "): ");
            try {
                int choice = scanner.nextInt();
                scanner.nextLine(); // Clear buffer
                
                if (choices.containsKey(choice)) {
                    Choice selectedChoice = choices.get(choice);
                    System.out.println("\n> " + selectedChoice.getText());
                    return selectedChoice.getNextNodeId();
                } else {
                    System.out.println("Invalid choice. Please select a number between 1 and " + choices.size());
                }
            } catch (Exception e) {
                System.out.println("Please enter a valid number.");
                scanner.nextLine(); // Clear invalid input
            }
        }
    }
    
    private void displayEnding(String endingType) {
        System.out.println();
        System.out.println("*".repeat(60));
        switch (endingType) {
            case "VICTORY":
                System.out.println("           CONGRATULATIONS! YOU ACHIEVED VICTORY!");
                break;
            case "DEFEAT":
                System.out.println("              GAME OVER - Better luck next time!");
                break;
            case "MYSTERY":
                System.out.println("        THE MYSTERY CONTINUES... What happens next?");
                break;
            case "WISDOM":
                System.out.println("           YOU HAVE GAINED GREAT WISDOM!");
                break;
            default:
                System.out.println("                    THE END");
        }
        System.out.println("*".repeat(60));
    }
    
    private boolean askToPlayAgain() {
        System.out.print("\nWould you like to try a different path? (yes/y or no/n): ");
        String input = scanner.nextLine().trim().toLowerCase();
        return input.equals("yes") || input.equals("y");
    }
    
    private void initializeStory() {
        // Starting scene
        StoryNode start = new StoryNode(
            "You find yourself standing at the edge of an ancient, mystical forest. " +
            "The trees tower above you, their branches forming a canopy so thick that " +
            "only scattered beams of sunlight reach the forest floor. You hear the " +
            "distant sound of running water and the occasional bird call. A worn path " +
            "leads deeper into the forest, while to your right you notice what appears " +
            "to be an old, abandoned cottage."
        );
        start.addChoice(1, new Choice("Follow the path deeper into the forest", "forest_path"));
        start.addChoice(2, new Choice("Investigate the abandoned cottage", "cottage"));
        start.addChoice(3, new Choice("Look for another way around the forest", "around_forest"));
        storyNodes.put("start", start);
        
        // Forest path
        StoryNode forestPath = new StoryNode(
            "You venture down the winding forest path. The deeper you go, the more " +
            "magical the forest becomes. Glowing mushrooms light your way, and you " +
            "can hear whispered conversations in languages you don't recognize. " +
            "Suddenly, you come to a fork in the path. The left path seems to lead " +
            "uphill toward what might be ruins, while the right path descends toward " +
            "the sound of flowing water."
        );
        forestPath.addChoice(1, new Choice("Take the left path toward the ruins", "ruins"));
        forestPath.addChoice(2, new Choice("Take the right path toward the water", "river"));
        forestPath.addChoice(3, new Choice("Try to climb a tree to get a better view", "tree_climb"));
        storyNodes.put("forest_path", forestPath);
        
        // Cottage investigation
        StoryNode cottage = new StoryNode(
            "You approach the cottage cautiously. It's clearly been abandoned for years, " +
            "with ivy covering most of the walls and several broken windows. However, " +
            "you notice smoke rising from the chimney. As you get closer, you hear " +
            "movement inside. The front door is slightly ajar, and you can see a warm " +
            "glow coming from within."
        );
        cottage.addChoice(1, new Choice("Knock on the door politely", "cottage_knock"));
        cottage.addChoice(2, new Choice("Sneak around to peek through a window", "cottage_peek"));
        cottage.addChoice(3, new Choice("Call out a greeting from a safe distance", "cottage_greeting"));
        storyNodes.put("cottage", cottage);
        
        // Around forest
        StoryNode aroundForest = new StoryNode(
            "You decide to skirt around the edge of the forest, looking for an easier " +
            "route. After walking for what feels like hours, you discover that the " +
            "forest is much larger than you initially thought. However, your detour " +
            "leads you to a beautiful meadow filled with wildflowers. In the center " +
            "of the meadow stands an ancient stone circle with symbols carved into " +
            "each stone."
        );
        aroundForest.addChoice(1, new Choice("Enter the stone circle", "stone_circle"));
        aroundForest.addChoice(2, new Choice("Examine the symbols more closely", "examine_symbols"));
        aroundForest.addChoice(3, new Choice("Rest in the meadow and enjoy the peaceful moment", "rest_meadow"));
        storyNodes.put("around_forest", aroundForest);
        
        // Ruins path
        StoryNode ruins = new StoryNode(
            "The path leads you to the crumbling remains of what was once a magnificent " +
            "castle. Moss and vines have reclaimed much of the structure, but you can " +
            "still see intricate carvings on some of the remaining walls. As you explore, " +
            "you discover a spiral staircase leading down into darkness. You also notice " +
            "a tower that, while damaged, still appears to be climbable."
        );
        ruins.addChoice(1, new Choice("Descend the spiral staircase", "dungeon"));
        ruins.addChoice(2, new Choice("Climb the tower", "tower"));
        ruins.addChoice(3, new Choice("Search the main ruins for artifacts", "search_ruins"));
        storyNodes.put("ruins", ruins);
        
        // River path
        StoryNode river = new StoryNode(
            "You follow the path to a crystal-clear river that sparkles in the dappled " +
            "sunlight. The water is so clear you can see colorful fish swimming below. " +
            "On the far bank, you notice what appears to be a small village. A rickety " +
            "wooden bridge spans the river, but it looks rather unstable. You also " +
            "notice some large stepping stones that might provide a safer crossing."
        );
        river.addChoice(1, new Choice("Cross the rickety bridge carefully", "bridge_cross"));
        river.addChoice(2, new Choice("Use the stepping stones", "stones_cross"));
        river.addChoice(3, new Choice("Follow the river to look for a better crossing", "river_follow"));
        storyNodes.put("river", river);
        
        // Tree climb
        StoryNode treeClimb = new StoryNode(
            "You choose a sturdy-looking tree and begin to climb. The bark is rough " +
            "but provides good grip, and soon you're high above the forest floor. " +
            "From your vantage point, you can see the entire forest spread out below " +
            "you. You spot the ruins, the river, a village, and something unexpected: " +
            "a clearing where several robed figures appear to be conducting some kind " +
            "of ceremony around a glowing object.",
            true, "WISDOM"
        );
        storyNodes.put("tree_climb", treeClimb);
        
        // Cottage knock
        StoryNode cottageKnock = new StoryNode(
            "You knock gently on the cottage door. After a moment, it opens to reveal " +
            "a kind-looking elderly woman with twinkling eyes. 'Oh my dear,' she says, " +
            "'I've been expecting you! I'm the Forest Guardian, and I have something " +
            "that belongs to you.' She hands you a small, glowing amulet. 'This will " +
            "protect you on your journey. The forest can be dangerous for those who " +
            "don't understand its ways.'",
            true, "VICTORY"
        );
        storyNodes.put("cottage_knock", cottageKnock);
        
        // Cottage peek
        StoryNode cottagePeek = new StoryNode(
            "You sneak around to peer through a cracked window. Inside, you see the " +
            "elderly woman stirring a large cauldron. Suddenly, she looks up and makes " +
            "direct eye contact with you through the window. 'Manners, young one!' she " +
            "calls out. You feel embarrassed but she smiles. 'Come in through the front " +
            "door like a civilized person.' Despite your awkward introduction, she " +
            "welcomes you warmly and shares her wisdom about the forest.",
            true, "WISDOM"
        );
        storyNodes.put("cottage_peek", cottagePeek);
        
        // Cottage greeting
        StoryNode cottageGreeting = new StoryNode(
            "You call out a friendly greeting from a respectful distance. The door " +
            "opens and a woman emerges, but something seems off. Her eyes glow with " +
            "an unnatural light, and when she speaks, her voice echoes strangely. " +
            "'You are wise to keep your distance, traveler. I am bound to this place " +
            "by an ancient curse. Leave now, before the curse spreads to you as well.' " +
            "You realize you've encountered a trapped spirit and quickly retreat.",
            true, "MYSTERY"
        );
        storyNodes.put("cottage_greeting", cottageGreeting);
        
        // Stone circle - Victory ending
        StoryNode stoneCircle = new StoryNode(
            "As you step into the center of the stone circle, the symbols begin to " +
            "glow with a soft, blue light. You feel a surge of ancient power flowing " +
            "through you. Visions flash before your eyes - you see the history of " +
            "this place, understand the magic that flows through the land, and realize " +
            "that you are the chosen guardian of this sacred site. You have found your " +
            "true destiny.",
            true, "VICTORY"
        );
        storyNodes.put("stone_circle", stoneCircle);
        
        // Examine symbols - Wisdom ending
        StoryNode examineSymbols = new StoryNode(
            "You spend time carefully studying each symbol carved into the ancient " +
            "stones. As you trace them with your finger, knowledge flows into your " +
            "mind. You learn about the ancient civilization that once thrived here, " +
            "their connection to nature, and their secrets of harmony with the forest. " +
            "You leave the circle much wiser than when you entered.",
            true, "WISDOM"
        );
        storyNodes.put("examine_symbols", examineSymbols);
        
        // Rest in meadow - Peaceful ending
        StoryNode restMeadow = new StoryNode(
            "You lie down in the soft grass among the wildflowers and gaze up at the " +
            "clouds drifting across the blue sky. For the first time in a long while, " +
            "you feel completely at peace. The stress and worries of your everyday " +
            "life seem to melt away. Sometimes the greatest adventure is simply " +
            "learning to appreciate the beauty that surrounds us.",
            true, "WISDOM"
        );
        storyNodes.put("rest_meadow", restMeadow);
        
        // Add more ending nodes for remaining paths
        addRemainingEndings();
    }
    
    private void addRemainingEndings() {
        // Dungeon ending
        StoryNode dungeon = new StoryNode(
            "The spiral staircase leads you deep underground to a vast chamber filled " +
            "with ancient treasures. However, as you step forward to examine them, " +
            "you trigger an ancient trap. The entrance seals behind you, but you " +
            "discover a hidden passage that leads to an underground river and " +
            "eventually to freedom, along with a small bag of gold coins.",
            true, "VICTORY"
        );
        storyNodes.put("dungeon", dungeon);
        
        // Tower ending
        StoryNode tower = new StoryNode(
            "You climb the damaged tower carefully, testing each step. At the top, " +
            "you find a powerful telescope that shows you visions of distant lands " +
            "and times. You see possible futures and understand that your choices " +
            "here will ripple through time. The knowledge is overwhelming, and you " +
            "carefully climb down, forever changed by what you've seen.",
            true, "WISDOM"
        );
        storyNodes.put("tower", tower);
        
        // Search ruins ending
        StoryNode searchRuins = new StoryNode(
            "While searching through the ruins, you accidentally awaken an ancient " +
            "guardian spirit. It's not hostile, but it's confused and lost. You " +
            "spend time helping it remember its purpose and find peace. In gratitude, " +
            "it bestows upon you a blessing of protection before finally moving on " +
            "to its eternal rest.",
            true, "VICTORY"
        );
        storyNodes.put("search_ruins", searchRuins);
        
        // Bridge cross ending
        StoryNode bridgeCross = new StoryNode(
            "You carefully cross the rickety bridge, but halfway across, some planks " +
            "give way! You manage to grab onto the rope railing and pull yourself to " +
            "safety, but the experience leaves you shaken. The villagers on the other " +
            "side help you recover and share stories of other brave travelers who " +
            "have made this dangerous crossing.",
            true, "VICTORY"
        );
        storyNodes.put("bridge_cross", bridgeCross);
        
        // Stones cross ending
        StoryNode stonesCross = new StoryNode(
            "You hop carefully from stone to stone across the river. The crossing " +
            "is easier than expected, and you enjoy the challenge. Halfway across, " +
            "you notice beautiful water flowers growing between the stones. You " +
            "arrive at the village refreshed and welcomed by the friendly locals " +
            "who invite you to stay for their harvest festival.",
            true, "VICTORY"
        );
        storyNodes.put("stones_cross", stonesCross);
        
        // River follow ending
        StoryNode riverFollow = new StoryNode(
            "You follow the river for miles, enjoying the peaceful sound of flowing " +
            "water and discovering many beautiful sights along the way. Eventually, " +
            "you find a natural ford where the water is shallow enough to cross " +
            "safely. Your patient approach rewards you with a safe journey and " +
            "beautiful memories of your time by the river.",
            true, "WISDOM"
        );
        storyNodes.put("river_follow", riverFollow);
    }
    
    // Inner classes for story structure
    private static class StoryNode {
        private String text;
        private Map<Integer, Choice> choices;
        private boolean isEndNode;
        private String endingType;
        
        public StoryNode(String text) {
            this.text = text;
            this.choices = new HashMap<>();
            this.isEndNode = false;
        }
        
        public StoryNode(String text, boolean isEndNode, String endingType) {
            this.text = text;
            this.choices = new HashMap<>();
            this.isEndNode = isEndNode;
            this.endingType = endingType;
        }
        
        public void addChoice(int number, Choice choice) {
            choices.put(number, choice);
        }
        
        public String getText() { return text; }
        public Map<Integer, Choice> getChoices() { return choices; }
        public boolean isEndNode() { return isEndNode; }
        public String getEndingType() { return endingType; }
    }
    
    private static class Choice {
        private String text;
        private String nextNodeId;
        
        public Choice(String text, String nextNodeId) {
            this.text = text;
            this.nextNodeId = nextNodeId;
        }
        
        public String getText() { return text; }
        public String getNextNodeId() { return nextNodeId; }
    }
}



