# recipe-book 🍕🍟🍔

The application for sharing your cooking recipes with others 🍟

## Table of content
- [Tech](#tech-)
- [Brief description](#brief-description-)
- [Launch](#launch-)

## Tech ⚙
- [Node.js](https://nodejs.org/en/)
- [Nest.js](https://nestjs.com/)
- [Redis (as a cache)](https://redis.io/)
- [MongoDB](https://www.mongodb.com/cloud/atlas/lp/try4?utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_core_prosp-brand_gic-null_emea-pl_ps-all_desktop_eng_lead&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624548&adgroup=115749720623&gclid=Cj0KCQiAtbqdBhDvARIsAGYnXBONxtdQy2F5ViOb7NYp8jgjHZdykkYs6-wuUZBBmOpMoXS8IAxBJMgaAn9ZEALw_wcB)
- [Docker](https://www.docker.com/)


## Brief Description 📝

Users can share their cooking recipes with others, they can also perform standard CRUD operations on their recipes. Only recipe owners can update/delete recipes.
Implemented features such as:
- JWT Authentication
- Nest Auth guards for permitting only recipe owners to perform update/delete operations.
- Redis cache
- Swagger documentation
- Pagination with details, such as last page, limit etc.

Uploaded the Docker image of the app to Dockerhub [https://hub.docker.com/r/korzepadawid/recipebook/tags](https://hub.docker.com/r/korzepadawid/recipebook/tags).

> Developed during the "REST API Development course" at Adam Mickiewicz University.

## Launch 🐳

### Dev

```
$ docker-compose -f docker-compose.dev.yaml up
```
### Navigation

- [http://localhost:3000/docs](http://localhost:3000/docs#/) - Swagger docs
- [http://localhost:8081/](http://localhost:8081/) - MongoDB admin interface 
- [http://localhost:8082/](http://localhost:8082/) - Web-UI to display and edit data within a cache
