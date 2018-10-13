var player;

var notes;
var current_note;
var current_note_index;

/**
 * Initialize twitch player to play a video
 * @param video_id twitch video id
 */
function ini_twitch_player(video_id) {
    notes = document.getElementById("notes").children[0];
    console.log("Playing video " + video_id);
    var options = {
        width: "80%",
        height: "100%",
        video: video_id,
    };

    player = new Twitch.Player("<player div ID>", options);
    player.setVolume(0.5);

    // Once the player is set, we want to refresh the timestamp every X seconds to update note highlights
    window.setInterval(set_timestamp_in_notes, 500);
}

/**
 * Highlight note at specified timestamp
 * @param timestamp Timestamp to highlight note at
 */
function highlight_note(timestamp) {
    // Make sure a current note is selected. Default to top one
    if(current_note === undefined) {
        current_note_index = 0;
        current_note = notes.children[0];
    }

    // We save the initial current note so that it can be checked for change at the bottom of the function
    let initial_current_note = current_note;

    let current_note_timestamp = current_note.getAttribute("data_timestamp");

    if(timestamp > current_note_timestamp) { // We want to highlight a note further than the current one
        let next_note = notes.children[current_note_index+1];

        while(next_note !== undefined && timestamp > next_note.getAttribute("data_timestamp")) {
            current_note_index++;
            next_note = notes.children[current_note_index + 1];
        }

        current_note = notes.children[current_note_index];
    } else if(timestamp < current_note_timestamp) { // We want to highlight a note before the current one
        // If the timestamp is already smaller than the current note, we know we have to go down at least note already.
        current_note_index--;
        current_note = notes.children[current_note_index];

        let previous_note = notes.children[current_note_index-1];

        while(previous_note !== undefined && timestamp < previous_note.getAttribute("data_timestamp")) {
            current_note_index--;
            previous_note = notes.children[current_note_index - 1];
        }

        current_note = notes.children[current_note_index];
    }

    if(current_note !== initial_current_note) {
        initial_current_note.classList.remove("highlight");
        current_note.classList.add("highlight");
        current_note.scrollIntoView();
    }
}

/**
 * Update timestamp display in note area of page
 */
function set_timestamp_in_notes() {
    let timestamp = player.getCurrentTime();
    document.getElementById("video_timestamp").innerText = timestamp;
    highlight_note(timestamp);
}

/**
 * Goto a note at a timestamp
 * @param timestamp timestamp to forward to
 */
function goto_note(timestamp) {
    if(player !== undefined) {
        player.seek(timestamp);
    }
}