const seedDatabase = db => {

   db.push('/users', [{
      id: 1,
      name: 'user',
      password: '$2a$10$GU9j6ty6VDaY0KuRJtks2.XEPhx2daM2NlmGVEdczP764zfDny0MK' // password: '1234'
   }])

   db.push('/tours', [{
      id: 1,
      name: 'Bad Kleinkirchheim',
      description: 'Austria',
      price: 1000,
      transport: 'Own',
      comments: [1]
   }, {
      id: 2,
      name: 'Saalbach',
      description: 'Austria',
      price: 1100,
      transport: 'Bus',
      comments: [2]
   }])

   db.push('/comments', [{
      id: 1,
      text: 'Amazing place.',
      createdBy: 1,
      createdAt: new Date(),
      tour: 1
   }, {
      id: 2,
      text: 'Great slopes. We really enjoyed our stay here.',
      createdBy: 1,
      createdAt: new Date(),
      tour: 2
   }])

}

module.exports = seedDatabase