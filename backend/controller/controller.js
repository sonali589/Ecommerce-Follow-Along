const getData = (req, res) => {
    try {
      res.status(200).json({ message: 'Data fetched successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  module.exports = { getData };