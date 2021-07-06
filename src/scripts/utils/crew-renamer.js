export const crewRenamer = (role) => {

    const translater = {
        "Director of Photography": "DP",
        "Director Of Photography": "DP",
        "Unit Director of Photography": "Unit DP",
        "Second Assistant Camera": "Second A.C.",
        "Assistant Art Director": "Assistant A.D.",
        "Executive Producer": "Exec Producer",
        "Unit Production Manager": "Unit Prod. Mgr",
        "Production Coordinator": "Prod. Coordinator",
        "Original Music Composer": "Composer",
        "Sound Re-Recording Mixer": "Re-Recorder",
        "Supervising Sound Editor": "Sound Ed. Super",
        "Sound Effects Editor": "Sound FX Ed.",
        "Visual Effects Supervisor": "VisFX Super",
        "Visual Effects Editor": "VisFX Editor",
        "Visual Effects Producer": "VisFX Prod.",
        "Special Effects Supervisor":"SpecialFX Super" 
    }
    let shortened  = role 

    let matchObj = {
        "Assistant": "Ass't",
        "Editor": "Ed.",
        "Production": "Prod'n",
        "Producer": "Prod.",
        "Executive":"Exec",
        "Associate Producer":"A.P.", 
        "Effects": "FX",
        "Manager": "Mgr.",
        "Post-Production": "Post-Prod'n"
    }

    shortened = parser(role, matchObj)

    if (/\s/g.test(role)) {
        if (translater[shortened]){
            return translater[shortened]
        } else if (shortened.split(" ").length > 2){
            let tempArr = shortened.split(" ");
            let newWord = tempArr[0] + " " + tempArr[1] + "..."
            return (newWord);
        } else {
            return shortened
        }
    } else {
        return shortened 
    }
}


const parser = (role, matchObj) => {
    let shortened = role 
    for (const matchWord in matchObj) {
        if (role.match(`.*\\b${matchWord}\\b.*`)) {
            shortened = role.replace(matchWord, matchObj[matchWord])
        }
        if (role.match(`.*\\b${matchWord}\\b.*`)) {
            shortened = role.replace(matchWord, matchObj[matchWord])
        }
    }
    // if (shortened.split(" ").length > 2){
    //     let tempArr = shortened.split(" ");
    //     let newWord = tempArr[0] + " " + tempArr[1] + "..."
    //     return (newWord);
    // } else {
    //     return shortened;
    // }
    return shortened
}
