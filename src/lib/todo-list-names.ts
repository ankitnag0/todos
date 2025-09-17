// src/lib/todo-list-names.ts
export const TODO_LIST_NAMES = [
  "🚀 Mission Control",
  "🎯 Target Practice",
  "🎪 Circus Tasks",
  "🧙‍♂️ Wizard's To-Do Scroll",
  "🏴‍☠️ Pirate's Booty List",
  "🦸‍♀️ Superhero Checklist",
  "🍳 Chef's Kitchen Queue",
  "📚 Scholar's Study Plan",
  "🎸 Rockstar's Gig List",
  "🌱 Gardener's Growth Plan",
  "🚢 Captain's Voyage Log",
  "🎨 Artist's Canvas Queue",
  "🕵️‍♀️ Detective's Case Files",
  "🧙‍♀️ Witch's Potion Brew List",
  "🦄 Unicorn's Sparkle Tasks",
  "🎮 Gamer's Quest Log",
  "👨‍🚀 Astronaut's Mission List",
  "🦸 Superhero Training Regimen",
  "🎪 Ringmaster's Performance Queue",
  "🏰 King's Royal Decree List",
  "🏴‍☠️ Captain's Plunder Plan",
  "🎭 Actor's Scene Memorization",
  "🎸 Musician's Practice Playlist",
  "🍳 Chef's Recipe Roster",
  "📚 Student's Homework Heap",
  "🕵️ Detective's Investigation List",
  "📷 Photographer's Shot List",
  "💃 Dancer's Choreography Queue",
  "🗺️ Explorer's Journey Planner",
  "🏗️ Architect's Blueprint List",
  "👩‍⚕️ Doctor's Patient Rounds",
  "🧑‍🏫 Teacher's Lesson Plan",
  "👨‍🌾 Farmer's Harvest Schedule",
  "👩‍🎨 Designer's Creative Queue",
  "🕵️ Spy's Mission Briefing",
  "🦸‍♂️ Sidekick's Support List",
  "🧙 Wizard's Spellbook Tasks",
  "🧚 Fairy's Magic To-Do's",
  "🧜‍♀️ Mermaid's Ocean Errands",
  "🧞 Genie's Wish Fulfillment",
  "🤖 Robot's Maintenance Schedule",
  "👽 Alien's Earth Exploration",
  "🦸 Villain's World Domination",
  "🎪 Clown's Joke Roster",
  "🎭 Mime's Silent Tasks",
  "🎸 DJ's Playlist Creation",
  "🍳 Baker's Fresh Bread Schedule",
  "📚 Writer's Story Outline",
  "🕵️ PI's Case Files",
  "📷 Influencer's Content Calendar",
  "💃 Choreographer's Move List",
  "🗺️ Traveler's Itinerary",
  "🏗️ Contractor's Build Queue",
  "👩‍⚕️ Nurse's Care Plan",
  "🧑‍🏫 Professor's Syllabus",
  "👨‍🌾 Gardener's Planting Guide",
  "👩‍🎨 Illustrator's Sketch Queue"
];

export function getRandomTodoListName() {
  const randomIndex = Math.floor(Math.random() * TODO_LIST_NAMES.length);
  return TODO_LIST_NAMES[randomIndex];
}

export function getCycledTodoListName(visitCount: number) {
  // Use visit count to cycle through names
  return TODO_LIST_NAMES[visitCount % TODO_LIST_NAMES.length];
}