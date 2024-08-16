+++
title = 'Embedded Snake Strategy'
date = 2024-08-12T22:53:27+02:00
draft = false
tags = ['Fun', 'Game Theory']
+++

For my first post, I wanted to experiment with embedding custom Javascript and CSS in a blog-post. Turns out it's really easy with embedded raw html in markdown files. The result can be played at the end of this article. I made the score tick down while the player(green snake squares) is searching for apples(red squares), which got me thinking about how to play Snake optimally.

The time-based scoring was implemented to encourage players to find quicker ways to collect apples instead of using *boring* strategies (i.e. [slithering along a hamiltonian path until the game is won](https://github.com/CheranMahalingam/Snake_Hamiltonian_Cycle_Solver/)). For each apple, the net score-gain is 50 minus the length of the path the player took to reach it. If the path towards an apple is greater than 50 steps this will result in a net-loss for the total score.

**Don't be reckless, however!** As the game continues and the snake gets bigger new apples get less and less space to randomly appear in. This results in a +1 increase to the minimum score-gain for the next apple in the aforementioned hamiltonian path method and similar gains in other safe methods. In contrast, unsafe playstyles tend to gain less points in the late game. This comes as a result of the growing costs of common mistakes, like creating a dead end for the snake. Another such mistake is splitting the "slitherable" space into multiple spaces/holes, which creates unreachable space for the apple to spawn in and makes a hamiltonian cycle around the whole board impossible. Therefore, **staying safe should be the number one priority**, especially in this smaller snake board.

As a quick aside, There exists a [smarter approach](https://johnflux.com/2015/05/02/nokia-6110-part-3-algorithms/) to the Hamiltonian path strategy that allows skipping parts of the path as long as the head stays behind the tail on the hamiltonian path. I love that people are still looking into Snake strategies to this day.

I recommend that newer players stick to a safe path first and try to get apples quicker if they know they can retreat to a safe path afterwards. I wish you luck on your slither-quest! {{< icon src="/img/slime_bounce.gif" alt=";)" >}}

# Embedded Snake 🐍

***Controls***:

* Move with the arrow-keys. (⬅️, ⬆️, ⬇️, ➡️)
* Pause/Unpause with the P-key (🅿️)
* Reset with the R-key (🇷)

{{< raw >}}
<link rel=stylesheet href="snake.css">
<script src="snake.js"></script>
<h2 style="text-align: center;">Score: <span id="score-counter"></span></h2>
<button id="play-button" type="button">Play / Pause</button>
<button id="reset-button" type="button">Reset</button>

<div id="snakegrid"><!-- JS puts a grid here --></div>
{{< /raw >}}
