class HeroService {
  constructor({ heroRepository }) {
    this.heroRepository = heroRepository;
  }
  async find(intemId){
    return this.heroRepository.find(intemId);
  }
  async create(data){
    return this.heroRepository.create(data);
  }
}

module.exports = HeroService;