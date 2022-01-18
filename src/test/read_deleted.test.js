require('dotenv').config();
const reddit = require('../reddit/client');
(async () => {
    const thread = await reddit.getSubmission('s71fi6').fetch();
    console.log(thread.comments);
    for(const comment of thread.comments){
        if(comment.removed) console.log("Comment was removed");
        if(comment.body === '[deleted]') console.log("Comment was deleted");
        console.log(comment.body);
    }
    
})();