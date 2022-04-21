namespace SpriteKind {
    export const Hidden = SpriteKind.create()
    export const tempTargetA = SpriteKind.create()
    export const tempTargetB = SpriteKind.create()
}
function spriteHandlerSetup () {
    spriteNames = []
    spriteObjects = []
    spriteImages = [img`
        . . 4 4 4 . . . . 4 4 4 . . . . 
        . 4 5 5 5 e . . e 5 5 5 4 . . . 
        4 5 5 5 5 5 e e 5 5 5 5 5 4 . . 
        4 5 5 4 4 5 5 5 5 4 4 5 5 4 . . 
        e 5 4 4 5 5 5 5 5 5 4 4 5 e . . 
        . e e 5 5 5 5 5 5 5 5 e e . . . 
        . . e 5 f 5 5 5 5 f 5 e . . . . 
        . . f 5 5 5 4 4 5 5 5 f . . f f 
        . . f 4 5 5 f f 5 5 6 f . f 5 f 
        . . . f 6 6 6 6 6 6 4 4 f 5 5 f 
        . . . f 4 5 5 5 5 5 5 4 4 5 f . 
        . . . f 5 5 5 5 5 4 5 5 f f . . 
        . . . f 5 f f f 5 f f 5 f . . . 
        . . . f f . . f f . . f f . . . 
        `]
    spriteImageArrays = []
    spriteImageIndex = []
    spritesRandom = []
    spriteValues = []
}
function nextSprite () {
    deactivateSprite(activeSprite)
    activateSprite((activeSprite + 1) % spriteCount)
}
function unfollowAll () {
    for (let unfollowIndex = 0; unfollowIndex <= spriteMaxIndex; unfollowIndex++) {
        getSpriteObject(unfollowIndex).follow(null)
    }
}
function spriteSetupMath () {
    spriteValues = createPuzzle()
    for (let mathIndex = 0; mathIndex <= spriteMaxIndex; mathIndex++) {
        spritesRandom[mathIndex] = spriteValues._pickRandom()
        spriteValues.removeAt(spriteValues.indexOf(spritesRandom[mathIndex]))
    }
    spriteValues = spritesRandom
    spriteSayValues()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    sortSpritesByX()
    spriteCheckMath()
})
function isDpad () {
    return controller.up.isPressed() || controller.down.isPressed() || (controller.left.isPressed() || controller.right.isPressed())
}
function advanceSpriteImage (spriteNumber: number) {
    spriteImageIndex[spriteNumber] = (spriteImageIndex[spriteNumber] + 1) % spriteImageArrays[spriteNumber].length
    setSpriteImage(spriteNumber, spriteImageIndex[spriteNumber])
}
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    unfollowAll()
})
function setSpriteObject (spriteNumber: number, newSprite: Sprite) {
    spriteObjects[spriteNumber] = newSprite
}
function arrangeSprites () {
    for (let arrangeSpriteIndex = 0; arrangeSpriteIndex <= spriteMaxIndex; arrangeSpriteIndex++) {
        getSpriteObject(arrangeSpriteIndex).setPosition(20 + arrangeSpriteIndex * 30, randint(0, 90))
        getSpriteObject(arrangeSpriteIndex).sayText(getSpriteName(arrangeSpriteIndex), 2000)
        for (let index = 0; index < 4; index++) {
            animation.runImageAnimation(
            getSpriteObject(arrangeSpriteIndex),
            getSpriteImageArray(arrangeSpriteIndex),
            randint(500, 100),
            false
            )
        }
        animation.runMovementAnimation(
        getSpriteObject(arrangeSpriteIndex),
        animation.animationPresets(animation.easeDown),
        2000,
        false
        )
    }
}
function findSolutions () {
    solvedOp1 = lastPuzzle[0]
    solvedOp2 = lastPuzzle[1]
    solvedFunc1 = lastPuzzle[2]
    solvedFunc2 = lastPuzzle[3]
    solvedResult = lastPuzzle[4]
    puzzleSolutionList = []
    if (mathFunctions.indexOf(solvedFunc1) % 2 == 0) {
        puzzleSolutionList[0] = [
        solvedOp1,
        solvedFunc1,
        solvedOp2,
        solvedFunc2,
        solvedResult
        ]
        puzzleSolutionList[1] = [
        solvedOp2,
        solvedFunc1,
        solvedOp1,
        solvedFunc2,
        solvedResult
        ]
    } else {
        puzzleSolutionList[0] = [
        solvedResult,
        solvedFunc1,
        solvedOp1,
        solvedFunc2,
        solvedOp2
        ]
        puzzleSolutionList[1] = [
        solvedResult,
        solvedFunc1,
        solvedOp2,
        solvedFunc2,
        solvedOp1
        ]
    }
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    music.knock.play()
    nextSprite()
})
function getSpriteName (spriteNumber: number) {
    return spriteNames[spriteNumber]
}
function setSpriteImage (spriteNumber: number, newImageIndex: number) {
    spriteObjects[spriteNumber].setImage(spriteImageArrays[spriteNumber][newImageIndex])
    spriteImageIndex[spriteNumber] = newImageIndex
}
function compare (a: number, b: number) {
    return a < b
}
function getSpriteObject (spriteNumber: number) {
    return spriteObjects[spriteNumber]
}
function getSpriteImageArray (spriteNumber: number) {
    return spriteImageArrays[spriteNumber]
}
function advancedSolver () {
    findSolutions()
    isSolved()
    if (isSolvedPuzzle) {
        spriteCheckMath()
    } else {
        for (let swapIndex = 0; swapIndex <= spriteMaxIndex; swapIndex++) {
            sortSpritesByX()
            if (spriteValues[sortedSpritesX[swapIndex]] != puzzleSolutionList[matchingSolution][swapIndex]) {
                isAutoSolved = true
                swapSprites(sortedSpritesX[swapIndex], spriteValues.indexOf(puzzleSolutionList[matchingSolution][swapIndex]))
            }
        }
        lineupSprites()
        pause(300)
        spriteCheckMath()
    }
}
function pluralize (singleString: string, itemCount: number) {
    if (itemCount > 1) {
        return "" + singleString + "s"
    } else {
        return "" + singleString
    }
}
function nextPuzzle () {
    unfollowAll()
    arrangeSprites()
    isAutoSolved = false
    spriteSetupMath()
}
function solvePuzzle () {
    findSolutions()
    solvedSortedSprites = []
    for (let solveIndex = 0; solveIndex <= spriteMaxIndex; solveIndex++) {
        solvedSortedSprites[solveIndex] = spriteValues.indexOf(puzzleSolutionList[0][solveIndex])
    }
    solutionMovesRequired = 0
    for (let swapIndex2 = 0; swapIndex2 <= spriteMaxIndex; swapIndex2++) {
        sortSpritesByX()
        isSolvedPosition = false
        for (let checkPuzzle of puzzleSolutionList) {
            if (spriteValues[sortedSpritesX[swapIndex2]] == checkPuzzle[swapIndex2]) {
                isSolvedPosition = true
            }
        }
        if (!(isSolvedPosition)) {
            isAutoSolved = true
            solutionMovesRequired += 1
            swapSprites(sortedSpritesX[swapIndex2], solvedSortedSprites[swapIndex2])
        }
    }
    lineupSprites()
    pause(200)
    spriteCheckMath()
}
function isSolved () {
    matchingSolution = -1
    movesRequiredList = []
    checkPuzzle2 = []
    smallestMoves = 99
    sortSpritesByX()
    for (let solutionIndex = 0; solutionIndex <= puzzleSolutionList.length - 1; solutionIndex++) {
        checkPuzzle2 = puzzleSolutionList[solutionIndex]
        isSolvedPuzzle = true
        solutionMovesRequired = 0
        for (let spriteValueIndex = 0; spriteValueIndex <= spriteMaxIndex; spriteValueIndex++) {
            if (spriteValues[sortedSpritesX[spriteValueIndex]] != checkPuzzle2[spriteValueIndex]) {
                isSolvedPuzzle = false
                solutionMovesRequired += 1
            }
            movesRequiredList[solutionIndex] = solutionMovesRequired
        }
        if (solutionMovesRequired < smallestMoves) {
            matchingSolution = solutionIndex
            smallestMoves = solutionMovesRequired
        }
        if (isSolvedPuzzle) {
            break;
        }
    }
    return isSolvedPuzzle
}
function sortSpritesByX () {
    let spriteXPositions: number[] = []
    for (let spriteSortIndex = 0; spriteSortIndex <= spriteMaxIndex; spriteSortIndex++) {
        spriteXPositions[spriteSortIndex] = getSpriteObject(spriteSortIndex).x
        sortedSpritesX[spriteSortIndex] = spriteSortIndex
    }
    for (let i = 0; i <= spriteXPositions.length - 1; i++) {
        for (let j = 0; j <= i - 1; j++) {
            if (compare(spriteXPositions[i], spriteXPositions[j])) {
                tmp = spriteXPositions[i]
                spriteXPositions[i] = spriteXPositions[j]
                spriteXPositions[j] = tmp
                tmp2 = sortedSpritesX[i]
                sortedSpritesX[i] = sortedSpritesX[j]
                sortedSpritesX[j] = tmp2
            }
        }
    }
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    advancedSolver()
})
function lineupSprites () {
    spriteTargets = []
    for (let arrangeSpriteIndex2 = 0; arrangeSpriteIndex2 <= spriteMaxIndex; arrangeSpriteIndex2++) {
        spriteTargets[arrangeSpriteIndex2] = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Hidden)
        spriteTargets[arrangeSpriteIndex2].setPosition(20 + arrangeSpriteIndex2 * 30, 110)
        sortSpritesByX()
        getSpriteObject(sortedSpritesX[arrangeSpriteIndex2]).follow(spriteTargets[arrangeSpriteIndex2])
    }
}
function spriteCheckMath () {
    mathString = ""
    for (let mathSpriteIndex = 0; mathSpriteIndex <= 4; mathSpriteIndex++) {
        mathString = "" + mathString + spriteValues[sortedSpritesX[mathSpriteIndex]]
    }
    mathOp1 = parseFloat(spriteValues[sortedSpritesX[0]])
    mathFunc = spriteValues[sortedSpritesX[1]]
    mathOp2 = parseFloat(spriteValues[sortedSpritesX[2]])
    mathComp = spriteValues[sortedSpritesX[3]]
    mathResult = parseFloat(spriteValues[sortedSpritesX[4]])
    mathCorrect = false
    if (mathComp == "=") {
        if (mathFunc == "+") {
            if (mathOp1 + mathOp2 == mathResult) {
                mathCorrect = true
            }
        }
        if (mathFunc == "-") {
            if (mathOp1 - mathOp2 == mathResult) {
                mathCorrect = true
            }
        }
        if (mathFunc == "x") {
            if (mathOp1 * mathOp2 == mathResult) {
                mathCorrect = true
            }
        }
    }
    if (mathFunc == "/" || mathFunc == "÷") {
        if (mathOp1 / mathOp2 == mathResult) {
            mathCorrect = true
        }
    }
    if (mathCorrect) {
        giveAward()
    } else {
        info.changeLifeBy(-1)
        music.powerDown.play()
        game.showLongText("Sorry, " + convertToText(mathString) + " is not correct. Try again or press Menu to solve.", DialogLayout.Top)
    }
}
function setSpriteName (spriteNumber: number, newName: string) {
    spriteNames[spriteNumber] = newName
}
function swapSprites (spriteA: number, spriteB: number) {
    spriteObjA = getSpriteObject(spriteA)
    spriteObjB = getSpriteObject(spriteB)
    tempSpriteA = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.tempTargetA)
    tempSpriteB = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.tempTargetB)
    tempSpriteA.setPosition(spriteObjA.x, spriteObjA.y)
    tempSpriteB.setPosition(spriteObjB.x, spriteObjB.y)
    spriteObjB.follow(tempSpriteA)
    spriteObjA.follow(tempSpriteB)
    pause(1000)
}
function activateSprite (spriteNumber: number) {
    activeSprite = spriteNumber
    controller.moveSprite(getSpriteObject(spriteNumber))
    animation.runMovementAnimation(
    getSpriteObject(spriteNumber),
    animation.animationPresets(animation.bobbing),
    500,
    false
    )
    pause(100)
}
function spriteSetup () {
    spriteNames[0] = "Benji"
    spriteImageArrays[0] = [img`
        . . 4 4 4 . . . . 4 4 4 . . . . 
        . 4 5 5 5 e . . e 5 5 5 4 . . . 
        4 5 5 5 5 5 e e 5 5 5 5 5 4 . . 
        4 5 5 4 4 5 5 5 5 4 4 5 5 4 . . 
        e 5 4 4 5 5 5 5 5 5 4 4 5 e . . 
        . e e 5 5 5 5 5 5 5 5 e e . . . 
        . . e 5 f 5 5 5 5 f 5 e . . . . 
        . . f 5 5 5 4 4 5 5 5 f . . f f 
        . . f 4 5 5 f f 5 5 6 f . f 5 f 
        . . . f 6 6 6 6 6 6 4 4 f 5 5 f 
        . . . f 4 5 5 5 5 5 5 4 4 5 f . 
        . . . f 5 5 5 5 5 4 5 5 f f . . 
        . . . f 5 f f f 5 f f 5 f . . . 
        . . . f f . . f f . . f f . . . 
        `, img`
        . . 4 4 4 . . . . 4 4 4 . . . . 
        . 4 5 5 5 e . . e 5 5 5 4 . . . 
        4 5 5 5 5 5 e e 5 5 5 5 5 4 . . 
        4 5 5 4 4 5 5 5 5 4 4 5 5 4 . . 
        e 5 4 4 5 5 5 5 5 5 4 4 5 e . . 
        . e e 5 5 5 5 5 5 5 5 e e . . . 
        . . e 5 f 5 5 5 5 f 5 e . . . . 
        . . f 5 5 5 4 4 5 5 5 f . . f f 
        . . f 4 5 5 f f 5 5 6 f . f 5 f 
        . . . f 6 6 6 6 6 6 4 4 f 5 5 f 
        . . . f 4 5 5 5 5 5 5 4 4 5 f . 
        . . . f 5 5 5 5 5 4 5 5 f f . . 
        . . . f 5 f f f 5 f f 5 f . . . 
        . . . f f . . f f . . f f . . . 
        `, img`
        . . . . . . . . . . . . . . . . 
        . . 4 4 4 . . . . 4 4 4 . . . . 
        . 4 5 5 5 e . . e 5 5 5 4 . . . 
        4 5 5 5 5 5 e e 5 5 5 5 5 4 . . 
        4 5 5 4 4 5 5 5 5 4 4 5 5 4 . . 
        e 5 4 4 5 5 5 5 5 5 4 4 5 e . . 
        . e e 5 5 5 5 5 5 5 5 e e . . . 
        . . e 5 f 5 5 5 5 f 5 e . . . . 
        . . f 5 5 5 4 4 5 5 5 f . f f . 
        . . . 4 5 5 f f 5 5 6 f f 5 f . 
        . . . f 6 6 6 6 6 6 4 f 5 5 f . 
        . . . f 5 5 5 5 5 5 5 4 5 f . . 
        . . . . f 5 4 5 f 5 f f f . . . 
        . . . . . f f f f f f f . . . . 
        `]
    spriteNames[1] = "Mia"
    spriteImageArrays[1] = [img`
        e e e . . . . e e e . . . . 
        c d d c . . c d d c . . . . 
        c b d d f f d d b c . . . . 
        c 3 b d d b d b 3 c . . . . 
        f b 3 d d d d 3 b f . . . . 
        e d d d d d d d d e . . . . 
        e d f d d d d f d e . b f b 
        f d d f d d f d d f . f d f 
        f b d d b b d d 2 f . f d f 
        . f 2 2 2 2 2 2 b b f f d f 
        . f b d d d d d d b b d b f 
        . f d d d d d b d d f f f . 
        . f d f f f d f f d f . . . 
        . f f . . f f . . f f . . . 
        `, img`
        . . . . . . . . . . . . . . 
        e e e . . . . e e e . . . . 
        c d d c . . c d d c . . . . 
        c b d d f f d d b c . . . . 
        c 3 b d d b d b 3 c . . . . 
        f b 3 d d d d 3 b f . . . . 
        e d d d d d d d d e . . . . 
        e d f d d d d f d e b f b . 
        f d d f d d f d d f f d f . 
        f b d d b b d d 2 b f d f . 
        . f 2 2 2 2 2 2 d b d b f . 
        . f d d d d d d d f f f . . 
        . f d b d f f f d f . . . . 
        . . f f f f . . f f . . . . 
        `, img`
        . . . . . . . . . . . . . . 
        e e e . . . . e e e . . . . 
        c d d c . . c d d c . . . . 
        c b d d f f d d b c . . . . 
        c 3 b d d b d b 3 c . . . . 
        f b 3 d d d d 3 b f . . . . 
        e d d d d d d d d e . . . . 
        e d f d d d d f d e . b f b 
        f d d f d d f d d f . f d f 
        f b d d b b d d 2 b f f d f 
        . f 2 2 2 2 2 2 d b b d b f 
        . f d d d d d d d f f f f . 
        . . f d b d f d f . . . . . 
        . . . f f f f f f . . . . . 
        `]
    spriteNames[2] = "Karl"
    spriteImageArrays[2] = [
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . c c c c . . . . 
        . . . . . . c c d d d d c . . . 
        . . . . . c c c c c c d c . . . 
        . . . . c c 4 4 4 4 d c c . . . 
        . . . c 4 d 4 4 4 4 4 1 c . c c 
        . . c 4 4 4 1 4 4 4 4 d 1 c 4 c 
        . c 4 4 4 4 1 4 4 4 4 4 1 c 4 c 
        f 4 4 4 4 4 1 4 4 4 4 4 1 4 4 f 
        f 4 4 4 f 4 1 c c 4 4 4 1 f 4 f 
        f 4 4 4 4 4 1 4 4 f 4 4 d f 4 f 
        . f 4 4 4 4 1 c 4 f 4 d f f f f 
        . . f f 4 d 4 4 f f 4 c f c . . 
        . . . . f f 4 4 4 4 c d b c . . 
        . . . . . . f f f f d d d c . . 
        . . . . . . . . . . c c c . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . c c c c c . . . . 
        . . . . . . c d d d d d c . . . 
        . . . . . . c c c c c d c . . . 
        . . . . . c 4 4 4 4 d c c . . . 
        . . . . c d 4 4 4 4 4 1 c . . . 
        . . . c 4 4 1 4 4 4 4 4 1 c . . 
        . . c 4 4 4 4 1 4 4 4 4 1 c c c 
        . c 4 4 4 4 4 1 c c 4 4 1 4 4 c 
        . c 4 4 4 4 4 1 4 4 f 4 1 f 4 f 
        f 4 4 4 4 f 4 1 c 4 f 4 d f 4 f 
        f 4 4 4 4 4 4 1 4 f f 4 f f 4 f 
        . f 4 4 4 4 1 4 4 4 4 c b c f f 
        . . f f f d 4 4 4 4 c d d c . . 
        . . . . . f f f f f c c c . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . c c c c . . . . 
        . . . . . . c c d d d d c . . . 
        . . . . . c c c c c c d c . . . 
        . . . . c c 4 4 4 4 d c c . c c 
        . . . c 4 d 4 4 4 4 4 1 c c 4 c 
        . . c 4 4 4 1 4 4 4 4 d 1 c 4 f 
        . c 4 4 4 4 1 4 4 4 4 4 1 4 4 f 
        f 4 4 4 4 4 1 1 c f 4 4 1 f 4 f 
        f 4 4 4 f 4 1 c 4 f 4 4 1 f 4 f 
        f 4 4 4 4 4 1 4 4 f 4 4 d f f f 
        . f 4 4 4 4 1 c c 4 4 d f f . . 
        . . f f 4 d 4 4 4 4 4 c f . . . 
        . . . . f f 4 4 4 4 c d b c . . 
        . . . . . . f f f f d d d c . . 
        . . . . . . . . . . c c c . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . c c c c . . . 
        . . . . . . . c c d d d d c . . 
        . . . . . c c c c c c d d c . . 
        . . . c c c 4 4 4 4 d c c c c c 
        . . c 4 4 1 4 4 4 4 4 1 c c 4 f 
        . c 4 4 4 4 1 4 4 4 4 d 1 f 4 f 
        f 4 4 4 4 4 1 4 4 4 4 4 1 f 4 f 
        f 4 4 f 4 4 1 4 c f 4 4 1 4 4 f 
        f 4 4 4 4 4 1 c 4 f 4 4 1 f f f 
        . f 4 4 4 4 1 4 4 f 4 4 d f . . 
        . . f 4 4 1 4 c c 4 4 d f . . . 
        . . . f d 4 4 4 4 4 4 c f . . . 
        . . . . f f 4 4 4 4 c d b c . . 
        . . . . . . f f f f d d d c . . 
        . . . . . . . . . . c c c . . . 
        `
    ]
    spriteNames[3] = "Marla"
    spriteImageArrays[3] = [
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . c c c c c c . . . 
        . . . . . . c 5 5 5 5 5 c c . . 
        . . . . . c 5 5 5 5 5 5 5 5 c . 
        . . . . c b b b b b b 5 5 5 c . 
        . . . . c b b b b 1 b b c c . . 
        . . . . c 1 1 b b 1 1 1 c . . . 
        . . . c 1 1 1 1 b 1 1 1 c . . . 
        . . . c 1 1 1 1 b 1 1 1 b b c c 
        . . c c d 1 1 1 b 1 b 1 5 5 5 c 
        . . c c d 1 c 1 1 1 b 1 b b 5 c 
        . c c d d 1 1 1 1 1 b 1 f b 5 c 
        f d d d 1 1 1 1 1 b b b f . c c 
        f f f f f 1 1 1 b b 5 5 5 f . . 
        . . . . . f f f 5 5 5 5 5 f . . 
        . . . . . . . . f f f f f f . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . c c c c c . . . 
        . . . . . . c c 5 5 5 5 5 c . . 
        . . . . . c 5 5 5 5 5 5 5 5 c . 
        . . . . c b b b b b b 5 5 5 c . 
        . . . . c 1 1 b b 1 b b c c . . 
        . . . c 1 1 1 b b 1 1 1 c . . . 
        . . . c 1 1 1 1 b 1 1 1 c . c c 
        . . . c d 1 1 1 b 1 1 1 b b 5 c 
        . . c c d 1 c 1 b 1 b 1 5 5 5 c 
        . c c d d 1 1 1 1 1 b 1 b b 5 c 
        f d d d 1 1 1 1 1 b b 1 f . c c 
        f f f 1 1 1 1 1 1 b b b f . . . 
        . . . f f 1 1 1 b b b 5 5 f . . 
        . . . . . f f f 5 5 5 5 5 f . . 
        . . . . . . . . f f f f f f . . 
        `,
    img`
        . . . . . . . . . c c c c c . . 
        . . . . . . c c c 5 5 5 5 c c . 
        . . . . c c 5 5 5 5 5 5 5 5 c . 
        . . . . c b b b b b b 5 5 5 c . 
        . . . c 1 1 1 b b 1 b b c c . . 
        . . . c 1 1 1 1 b 1 1 1 c . c c 
        . . . c d 1 1 1 b 1 1 1 c b 5 c 
        . . c c d 1 c 1 b 1 1 1 b b 5 c 
        c c c d d 1 1 1 b 1 b 1 5 5 5 c 
        f d d d 1 1 1 1 1 1 b 1 b b c c 
        . f f 1 1 1 1 1 1 b b 1 f . . . 
        . . . f 1 1 1 1 1 b b b f . . . 
        . . . . f f 1 1 b b 5 5 f . . . 
        . . . . . . f 5 5 5 5 5 f . . . 
        . . . . . . . f f f f f f . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . c c c c c . . . 
        . . . . . . c c 5 5 5 5 5 c . . 
        . . . . . c 5 5 5 5 5 5 5 5 c . 
        . . . . c b b b b b b 5 5 5 c . 
        . . . . c 1 1 b b 1 b b c c . . 
        . . . c 1 1 1 b b 1 1 1 c . . . 
        . . . c 1 1 1 1 b 1 1 1 c . c c 
        . . . c d 1 1 1 b 1 1 1 b b 5 c 
        . . c c d 1 c 1 b 1 b 1 5 5 5 c 
        . c c d d 1 1 1 1 1 b 1 b b 5 c 
        f d d d 1 1 1 1 1 b b 1 f . c c 
        f f f 1 1 1 1 1 1 b b b f . . . 
        . . . f f 1 1 1 b b b 5 5 f . . 
        . . . . . f f f 5 5 5 5 5 f . . 
        . . . . . . . . f f f f f f . . 
        . . . . . . . . . . . . . . . . 
        `
    ]
    spriteNames[4] = "Sam"
    spriteImageArrays[4] = [
    img`
        . . . . c c c c c c . . . . . . 
        . . . c 6 7 7 7 7 6 c . . . . . 
        . . c 7 7 7 7 7 7 7 7 c . . . . 
        . c 6 7 7 7 7 7 7 7 7 6 c . . . 
        . c 7 c 6 6 6 6 c 7 7 7 c . . . 
        . f 7 6 f 6 6 f 6 7 7 7 f . . . 
        . f 7 7 7 7 7 7 7 7 7 7 f . . . 
        . . f 7 7 7 7 6 c 7 7 6 f c . . 
        . . . f c c c c 7 7 6 f 7 7 c . 
        . . c 7 2 7 7 7 6 c f 7 7 7 7 c 
        . c 7 7 2 7 7 c f c 6 7 7 6 c c 
        c 1 1 1 1 7 6 f c c 6 6 6 c . . 
        f 1 1 1 1 1 6 6 c 6 6 6 6 f . . 
        f 6 1 1 1 1 1 6 6 6 6 6 c f . . 
        . f 6 1 1 1 1 1 1 6 6 6 f . . . 
        . . c c c c c c c c c f . . . . 
        `,
    img`
        . . . c c c c c c . . . . . . . 
        . . c 6 7 7 7 7 6 c . . . . . . 
        . c 7 7 7 7 7 7 7 7 c . . . . . 
        c 6 7 7 7 7 7 7 7 7 6 c . . . . 
        c 7 c 6 6 6 6 c 7 7 7 c . . . . 
        f 7 6 f 6 6 f 6 7 7 7 f . . . . 
        f 7 7 7 7 7 7 7 7 7 7 f . . . . 
        . f 7 7 7 7 6 c 7 7 6 f . . . . 
        . . f c c c c 7 7 6 f c c c . . 
        . . c 6 2 7 7 7 f c c 7 7 7 c . 
        . c 6 7 7 2 7 7 c f 6 7 7 7 7 c 
        . c 1 1 1 1 7 6 6 c 6 6 6 c c c 
        . c 1 1 1 1 1 6 6 6 6 6 6 c . . 
        . c 6 1 1 1 1 1 6 6 6 6 6 c . . 
        . . c 6 1 1 1 1 1 7 6 6 c c . . 
        . . . c c c c c c c c c c . . . 
        `,
    img`
        . . . . . c c c c c c c . . . . 
        . . . . c 6 7 7 7 7 7 6 c . . . 
        . . . c 7 c 6 6 6 6 c 7 6 c . . 
        . . c 6 7 6 f 6 6 f 6 7 7 c . . 
        . . c 7 7 7 7 7 7 7 7 7 7 c . . 
        . . f 7 8 1 f f 1 6 7 7 7 f . . 
        . . f 6 f 1 f f 1 f 7 7 7 f . . 
        . . . f f 2 2 2 2 f 7 7 6 f . . 
        . . c c f 2 2 2 2 7 7 6 f c . . 
        . c 7 7 7 7 7 7 7 7 c c 7 7 c . 
        c 7 1 1 1 7 7 7 7 f c 6 7 7 7 c 
        f 1 1 1 1 1 7 6 f c c 6 6 6 c c 
        f 1 1 1 1 1 1 6 6 c 6 6 6 c . . 
        f 6 1 1 1 1 1 6 6 6 6 6 6 c . . 
        . f 6 1 1 1 1 1 6 6 6 6 c . . . 
        . . f f c c c c c c c c . . . . 
        `,
    img`
        . . . . . . c c c c c c c . . . 
        . . . . . c f f 6 6 f f 7 c . . 
        . . . . c 7 6 6 6 6 6 6 7 6 c . 
        . . . c 7 7 7 7 7 7 7 7 7 7 c . 
        . . . c 7 8 1 f f 1 6 7 7 7 c . 
        . . . f 6 f 1 f f 1 f 7 7 7 f . 
        . . . f 6 f 2 2 2 2 f 7 7 7 f . 
        . . c c 6 f 2 2 2 2 f 7 7 6 f . 
        . c 7 7 7 7 2 2 2 2 7 7 f c . . 
        c 7 1 1 1 7 7 7 7 7 c c 7 7 c . 
        f 1 1 1 1 1 7 7 7 f c 6 7 7 7 c 
        f 1 1 1 1 1 1 6 f c c 6 6 6 c c 
        f 6 1 1 1 1 1 6 6 c 6 6 6 c . . 
        f 6 1 1 1 1 1 6 6 6 6 6 6 c . . 
        . f 6 1 1 1 1 6 6 6 6 6 c . . . 
        . . f f c c c c c c c c . . . . 
        `
    ]
    spriteCount = spriteNames.length
    spriteMaxIndex = spriteCount - 1
    for (let spriteIndex = 0; spriteIndex <= spriteMaxIndex; spriteIndex++) {
        setSpriteObject(spriteIndex, sprites.create(spriteImageArrays[spriteIndex][0], SpriteKind.Player))
        getSpriteObject(spriteIndex).setStayInScreen(true)
        setSpriteImage(spriteIndex, 0)
    }
}
function spriteSayValues () {
    for (let thisSpriteIndex = 0; thisSpriteIndex <= spriteMaxIndex; thisSpriteIndex++) {
        getSpriteObject(thisSpriteIndex).sayText(spriteValues[thisSpriteIndex], 1000000)
    }
}
function deactivateSprite (spriteNumber: number) {
    controller.moveSprite(getSpriteObject(spriteNumber), 0, 0)
}
function giveAward () {
    if (isAutoSolved) {
        if (smallestMoves % 2 != 0) {
            smallestMoves += 1
        }
        smallestMoves = smallestMoves / 2
        game.showLongText("You can see " + convertToText(mathString) + ". You were " + smallestMoves + pluralize(" move", smallestMoves) + " away.", DialogLayout.Top)
        nextPuzzle()
    } else {
        info.changeScoreBy(1)
        game.showLongText("Yes!" + convertToText(mathString) + ".", DialogLayout.Top)
        music.powerUp.play()
        nextPuzzle()
        if (info.score() % 10 == 0) {
            if (info.life() < 4) {
                effects.starField.startScreenEffect(2000)
                info.changeLifeBy(1)
            }
        }
        if (info.score() % 5 == 0) {
            effects.confetti.startScreenEffect(2000)
        }
    }
}
function createPuzzle () {
    mathFunctions = [
    "+",
    "-",
    "x",
    "÷"
    ]
    mathFuncIndex = randint(0, mathFunctions.length - 1)
    mathFunc = mathFunctions[mathFuncIndex]
    mathOp1 = randint(0, 100)
    mathOp2 = randint(0, 100)
    if (mathFuncIndex < 2) {
        mathResult = mathOp1 + mathOp2
    } else {
        mathResult = mathOp1 * mathOp2
    }
    lastPuzzle = [
    convertToText(mathOp1),
    convertToText(mathOp2),
    mathFunc,
    "=",
    convertToText(mathResult)
    ]
    return [
    convertToText(mathOp1),
    convertToText(mathOp2),
    mathFunc,
    "=",
    convertToText(mathResult)
    ]
}
let mathFuncIndex = 0
let tempSpriteB: Sprite = null
let tempSpriteA: Sprite = null
let spriteObjB: Sprite = null
let spriteObjA: Sprite = null
let mathCorrect = false
let mathResult = 0
let mathComp = ""
let mathOp2 = 0
let mathFunc = ""
let mathOp1 = 0
let mathString = ""
let spriteTargets: Sprite[] = []
let tmp2 = 0
let tmp = 0
let smallestMoves = 0
let checkPuzzle2: string[] = []
let movesRequiredList: number[] = []
let isSolvedPosition = false
let solutionMovesRequired = 0
let solvedSortedSprites: number[] = []
let isAutoSolved = false
let matchingSolution = 0
let sortedSpritesX: number[] = []
let isSolvedPuzzle = false
let mathFunctions: string[] = []
let puzzleSolutionList: string[][] = []
let solvedResult = ""
let solvedFunc2 = ""
let solvedFunc1 = ""
let solvedOp2 = ""
let lastPuzzle: string[] = []
let solvedOp1 = ""
let spriteMaxIndex = 0
let spriteCount = 0
let activeSprite = 0
let spriteValues: string[] = []
let spritesRandom: string[] = []
let spriteImageIndex: number[] = []
let spriteImageArrays: Image[][] = []
let spriteImages: Image[] = []
let spriteObjects: Sprite[] = []
let spriteNames: string[] = []
let savedPuzzle: number[] = []
spriteHandlerSetup()
spriteSetup()
activateSprite(0)
spriteSetupMath()
music.setVolume(100)
music.magicWand.play()
game.showLongText("WELCOME TO MATHTOWN ALLEY \\n Arrange the animals with the directional pad to make the math correct. \\n \\n Press A to switch animals. Press B to check your work. \\n \\n Press Menu to see the solution. ", DialogLayout.Full)
arrangeSprites()
pause(2000)
spriteSayValues()
game.onUpdateInterval(100, function () {
    if (isDpad()) {
        advanceSpriteImage(activeSprite)
    }
})
