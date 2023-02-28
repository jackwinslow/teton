// Display UI
figma.showUI(__html__);

// Resize UI
figma.ui.resize(460, 640);

let selectionLimit = 1

// ------- Send selected nodes upon plugin open --------
setTimeout(async function (){
    // Array of selected nodes
    const currentSelection = figma.currentPage.selection;

    if(currentSelection.length <= selectionLimit) {
        // Loop through selected and save frames to array
        let frames = []

        for(let i = 0; i < currentSelection.length; i++) {

            // Check if node is a frame
            if (currentSelection[i].type == "FRAME") {
    
                const bytes = await currentSelection[i].exportAsync({
                    format: 'PNG',
                    constraint: { type: 'SCALE', value: 1.5 },
                })
    
                frames.push({
                    "id": currentSelection[i].id,
                    "name": currentSelection[i].name,
                    "png": bytes,
                    "width": currentSelection[i].width,
                    "height": currentSelection[i].height
                })
            }
        }
        figma.ui.postMessage({ type: 'selection-change', frames });
    }
}, 200)

// Listen for frame selection changes
figma.on("selectionchange", async function() {

    // Array of selected nodes
    const currentSelection = figma.currentPage.selection;

    if(currentSelection.length <= selectionLimit) {
        // Loop through selected and save frames to array
        let frames = []

        for(let i = 0; i < currentSelection.length; i++) {

            // Check if node is a frame
            if (currentSelection[i].type == "FRAME") {
    
                const bytes = await currentSelection[i].exportAsync({
                    format: 'PNG',
                    constraint: { type: 'SCALE', value: 1.5 },
                })
    
                frames.push({
                    "id": currentSelection[i].id,
                    "name": currentSelection[i].name,
                    "png": bytes,
                    "width": currentSelection[i].width,
                    "height": currentSelection[i].height
                })
            }
        }
        figma.ui.postMessage({ type: 'selection-change', frames });
    }
})

// Handle incoming messages
figma.ui.onmessage = msg => {

    // Change frame selection limit
    if(msg.type == 'selection-limit') {
        selectionLimit = msg.limit
    }

    // Generate graphic
    if(msg.type == 'generate') {

        // Set state and final frame
        let state = msg.state

        // Declare height here
        let height, currentFrame, image, scale, newFrame, i

        const frame = figma.createFrame()
        frame.resize(1440,1024)

        // Set background color and image if necessary
        if (state.backgroundImage != undefined) {
            let backgroundImage = figma.createImage(state.backgroundImage.png)
            frame.fills = [{
                imageHash: backgroundImage.hash,
                scaleMode: "FILL",
                scalingFactor: 1,
                type: "IMAGE",
            }]
        } else {
            let rgb = hexToRgb(state.backgroundColor)
            frame.fills = [{  type: 'SOLID',  color: {r: rgb.red/255, g: rgb.green/255, b: rgb.blue/255}}];
        }

        switch(state.layout) {
            case 0:

                // Set height here
                height = 700

                // Set current frame, image, and scale
                currentFrame = state.frames[0]
                image = figma.createImage(currentFrame.png)
                scale = height/currentFrame.height

                // Make new frame and fill in image
                newFrame = figma.createFrame()
                newFrame.resize(currentFrame.width*scale, height)
                newFrame.fills = [{
                    imageHash: image.hash,
                    scaleMode: "FILL",
                    scalingFactor: scale,
                    type: "IMAGE"
                }]

                // Add shadow to frame
                newFrame.effects = [{
                    type: "DROP_SHADOW",
                    color: {r: 0, g: 0, b: 0, a: 0.3},
                    offset: {x: 0, y: 5},
                    radius: 30,
                    visible: true,
                    blendMode: "NORMAL"
                }]

                // Calculate offset to center new frame within final frame
                const offsetX = (frame.width - newFrame.width) / 2
                const offsetY = (frame.height - newFrame.height) / 2

                // Apply offset
                newFrame.x = offsetX
                newFrame.y = offsetY

                // Append to final frame
                frame.appendChild(newFrame)

                break;
            case 1:

                // Set height here
                height = 520

                // Iterating index
                i = 0

                // Loop through set number of rows
                for(let row = 0; row < 3; row++) {

                    // Row variables
                    let rowLength = 0
                    let rowOffset = 280
                    let rowFrame = figma.createFrame()
                    rowFrame.resize(1800, height+60)
                    rowFrame.fills = [];

                    // This is to make sure that it fills the whole frame before moving to the next
                    while(rowLength < 1800) {

                        // Set current frame, image, and scale
                        currentFrame = state.frames[i]
                        image = figma.createImage(currentFrame.png)
                        scale = height/currentFrame.height

                        // Make new frame and fill in image
                        newFrame = figma.createFrame()
                        newFrame.resize(currentFrame.width*scale, height)
                        newFrame.fills = [{
                            imageHash: image.hash,
                            scaleMode: "FILL",
                            scalingFactor: scale,
                            type: "IMAGE",
                        }]

                        // Add frame to row and adjust position
                        rowFrame.appendChild(newFrame)
                        newFrame.x = rowLength + 60
                        newFrame.y = 30

                        // Add shadow to frame
                        newFrame.effects = [{
                            type: "DROP_SHADOW",
                            color: {r: 0, g: 0, b: 0, a: 0.2},
                            offset: {x: 0, y: 5},
                            radius: 30,
                            visible: true,
                            blendMode: "NORMAL"
                        }]

                        // Set variables
                        rowLength += 60 + currentFrame.width*scale
                        i = i < state.frames.length - 1 ? i += 1 : 0
                    }

                    // Adjust row position and add to final frame
                    rowFrame.x = -rowOffset
                    rowFrame.y = -100 + (row == 0 ? 0 : row * (rowFrame.height) + (30*row))
                    rowFrame.rotation = 15
                    frame.appendChild(rowFrame)
                }

                break;
            case 2:

                // Set height here
                height = 400

                // Iterating index
                i = 0

                // Loop through set number of rows
                for(let row = 0; row < 3; row++) {

                    // Row variables
                    let rowLength = 0
                    let rowOffset = 280
                    let rowFrame = figma.createFrame()
                    rowFrame.resize(2200, height+60)
                    rowFrame.fills = [];

                    // This is to make sure that it fills the whole frame before moving to the next
                    while(rowLength < 2200) {

                        // Set current frame, image, and scale
                        currentFrame = state.frames[i]
                        image = figma.createImage(currentFrame.png)
                        scale = height/currentFrame.height

                        // Make new frame and fill in image
                        newFrame = figma.createFrame()
                        newFrame.resize(currentFrame.width*scale, height)
                        newFrame.fills = [{
                            imageHash: image.hash,
                            scaleMode: "FILL",
                            scalingFactor: scale,
                            type: "IMAGE",
                        }]

                        // Add frame to row and adjust position
                        rowFrame.appendChild(newFrame)
                        newFrame.x = rowLength + 60
                        newFrame.y = 30

                        // Add shadow to frame
                        newFrame.effects = [{
                            type: "DROP_SHADOW",
                            color: {r: 0, g: 0, b: 0, a: 0.2},
                            offset: {x: 0, y: 5},
                            radius: 30,
                            visible: true,
                            blendMode: "NORMAL"
                        }]

                        // Set variables
                        rowLength += 60 + currentFrame.width*scale
                        i = i < state.frames.length - 1 ? i += 1 : 0
                    }

                    // Adjust row position and add to final frame
                    rowFrame.x = -70 - (rowOffset*row)
                    rowFrame.y = -220 + (row == 0 ? 0 : row * (rowFrame.height) + (15*row))
                    frame.appendChild(rowFrame)
                }

                break;
        }

        // Add final frame to figma project
        figma.currentPage.appendChild(frame);
    }

    // Close plugin
    if(msg.type == 'close-plugin') {
        figma.closePlugin()
    }
}

function hexToRgb(hex: string) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return {red: r, green: g, blue: b};
}