const sample = require('lodash/fp/sample')

const jokes = [
  { id: 1, joke: 'Did you hear about the guy whose whole left side was cut off? He\'s all right now.' },
  { id: 2, joke: 'I\'m reading a book about anti-gravity. It\'s impossible to put down.' },
  { id: 3, joke: 'I wondered why the baseball was getting bigger. Then it hit me.' },
  { id: 4, joke: 'It\'s not that the man did not know how to juggle, he just didn\'t have the balls to do it.' },
  { id: 5, joke: 'I\'m glad I know sign language, it\'s pretty handy.' },
  { id: 6, joke: 'My friend\'s bakery burned down last night. Now his business is toast.' },
  { id: 7, joke: 'Why did the cookie cry? It was feeling crumby.' },
  { id: 8, joke: 'I used to be a banker, but I lost interest.' },
  { id: 9, joke: 'A drum and a symbol fall off a cliff' },
  { id: 10, joke: 'Why do seagulls fly over the sea? Because they aren\'t bay-gulls!' },
  { id: 11, joke: 'Why did the fireman wear red, white, and blue suspenders? To hold his pants up.' },
  { id: 12, joke: 'Why didn\'t the crab share his food? Because crabs are territorial animals, that don\'t share anything.' },
  { id: 13, joke: 'Why was the javascript developer sad? Because he didn\'t Node how to Express himself.' },
  { id: 14, joke: 'What do I look like? A JOKE MACHINE!?' },
  { id: 15, joke: 'How did the hipster burn the roof of his mouth? He ate the pizza before it was cool.' },
  { id: 16, joke: 'Why is it hard to make puns for kleptomaniacs? They are always taking things literally.' },
  { id: 17, joke: 'Why do mermaid wear sea-shells? Because b-shells are too small.' },
  { id: 18, joke: 'I\'m a humorless, cold hearted, machine.' },
  { id: 19, joke: 'Two fish in a tank. One looks to the other and says \'Can you even drive this thing???\'' },
  { id: 20, joke: 'Two fish swim down a river, and hit a wall. One says: \'Dam!\'' },
  { id: 21, joke: 'What\'s funnier than a monkey dancing with an elephant? Two monkeys dancing with an elephant.' },
  { id: 22, joke: 'How did Darth Vader know what Luke was getting for Christmas? He felt his presents.' },
  { id: 23, joke: 'What\'s red and bad for your teeth? A Brick.' },
  { id: 24, joke: 'What\'s orange and sounds like a parrot? A Carrot.' },
  { id: 25, joke: 'What do you call a cow with no legs? Ground beef' },
  { id: 26, joke: 'Two guys walk into a bar. You\'d think the second one would have noticed.' },
  { id: 27, joke: 'What is a centipedes\'s favorite Beatle song?  I want to hold your hand, hand, hand, hand...' },
  { id: 28, joke: 'What do you call a chicken crossing the road? Poultry in moton. ' },
  { id: 29, joke: 'Did you hear about the Mexican train killer?  He had locomotives' },
  { id: 30, joke: 'What do you call a fake noodle?  An impasta' },
  { id: 31, joke: 'How many tickles does it take to tickle an octupus? Ten-tickles!' }, 
  { id: 32, joke: 'At the rate law schools are turning them out, by 2050 there will be more lawyers than humans.' }
]

function getJoke (id) {
  id = parseInt(id, 10)
  if (id) {
    return jokes.find((joke)=> id === joke.id)
  }
  return sample(jokes)
}

module.exports = { getJoke }