# Concept

Basically, Woffler is a dice game where each player can throw dice up to 3 times per turn, but can use 1st or 2nd try as a "turn" if its result is acceptable.

Turns are made on a circle divided to a certain number of cells (16). Some cells are just safe plane cells ("SAFE"), some ("GREEN") moves player to the next level circle, some ("RED") moves player back unless payment were made or quest solved (see "unjail" page).

Cells on the level circle are positioned randomly, but all players use the same circles, generated upon players' progress during the gameplay.

Level Circles are organised in branches, where each level can be forked only once. Player 1st solved a level extends its branch and becomes a  Current Winner of the branch. Winner of a branch gets paid from each revenue earned by this branch (see below). If a player wants to win a branch, he would look for a shortest one or fork his own. Branch forking and extending are sources for passive income, while there is also another ways.

Player solved the level of a branch can just TAKE his reward instead of forking or extending the branch. Reward is paid from the "pot" of the solved level and blocks players progress for a certain time interval (see "rewarding" page).

Once the level solved by a player, he can either TAKE his reward, or proceed to the NEXT level, or try to SPLIT solved level pot and start new branch by betting on it. Each bet (successful and unsuccessful) goes to the newly created branch "starting pot", while players betted on the branch became STAKEHOLDERS of this branch (see "take", "next", "split" pages).

Certain rate of all payments, accepted on a level of the branch, is instantly allocated upwards the tree according to the revenue share policy by the game contract (see "revenue share").

Payments are accepted for:

1. "unjail" - skip "red" cell and continue current level (price is UNJAIL_RATE% of current pot of the level for the moment of payment, but not less then UNJAIL_MIN, see "unjail");

2. "split" - bets for new branch upon level solved - if all winner (potential) reward was spent he can bet with his own funds (price is STAKE_RATE% of current pot of the solved level for the moment of payment, but not less then STAKE_MIN, see "split");
