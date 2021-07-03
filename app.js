//mongodb+srv://samuel:<password>@cluster0.hffls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority


const express = require('express');
const mongoose = require('mongoose');

const Thing = require('./models/thing');

const app = express();

mongoose.connect('mongodb+srv://samuel:jehovah10@cluster0.hffls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(() => {
  console.log('Successfully connected to MongoDB atlas!')
}).catch((error) => {
  console.log('Unable to connect to mongoDB atlas!')
  console.error(error)
})


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/stuff', (req, res, next) => {
    const thing = new Thing({
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      userId: req.body.userId,
      price: req.body.price
    })

    thing.save().then(() => {
      res.status(201).json({
        message: 'Post saved successfully'
      })
    }).catch(error => {
      res.status(400).json({error})
    })
  });

app.get('/api/stuff/:id', (req, res) => {
  Thing.findOne({
    _id: req.params.id
  }).then(thing => {
    res.status(200).json(thing)
  }).catch(error => {
    res.status(404).json({error})
  })
});

app.put('/api/stuff/:id', (req, res) => {
  const thing = new Thing({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    userId: req.body.userId,
    price: req.body.price
  });

  Thing.updateOne({_id: req.params.id}, thing).then(() => {
    res.status(201).json({
      message: 'Thing updated successfully'
    })
  }).catch(error => {
    res.status(400).json({error})
  })
});

app.delete('/api/stuff/:id', (req, res, next) => {
  Thing.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({error})
    })
});

app.use('/api/stuff', (req, res, next) => {
    Thing.find().then(things => {
      res.status(200).json(things)
    }).catch(error => {
      res.status(400).json({error})
    })
});


module.exports = app;