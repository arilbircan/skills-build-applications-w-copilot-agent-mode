import { Router } from 'express';
import type { Model } from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models';

function createCollectionRouter<T>(collection: Model<T>): Router {
  const router = Router();

  router.get('/', async (_request, response) => {
    const documents = await collection.find().lean().exec();
    response.json(documents);
  });

  return router;
}

export const usersRouter = createCollectionRouter(User);
export const teamsRouter = createCollectionRouter(Team);
export const activitiesRouter = createCollectionRouter(Activity);
export const leaderboardRouter = createCollectionRouter(Leaderboard);
export const workoutsRouter = createCollectionRouter(Workout);
