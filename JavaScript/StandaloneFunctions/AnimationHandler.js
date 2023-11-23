//Animation handler
//Ing. Tomas Jarusek, 11/2023

//class handling events and animations based on their timestamps
class Animation
{
	constructor() 
	{
        this.animationRunning = false;
        this.stopAfterCompletion = false;

		this.animationTime = 0;
        this.animationTotalTime = 0;
		
		this.animationCalendar = [];
		this.eventCalendar = [];

        this.startedThisFrame = false;
	}

    SetAnimationStarted()
    {
        this.animationRunning = true;

        this.startedThisFrame = true;
    }

    SetStopAfterCompletion(value)
    {
        this.stopAfterCompletion = value;
    }

    //TODO - infinite repeating animation loop
    //DrawRepeatingAnimation(deltaTime)
	//{
    //}
	
	//finite animation engine
	DrawFiniteAnimation(deltaTime)
	{
        //animation must be running
		if (this.animationRunning == true)
		{
            if (deltaTime === 0)
            {
                //delta time is zero - this means that the animation is paused
                //in this case, we don't execute events, because they would be executed on earlier frame where delta time was not zero
                //we only draw the existing state of animation

                //exception is when delta time is zero (animation is paused) on the first frame
                //in that case, events at time zero are executed once
                if (this.startedThisFrame === true)
                {   
                    this.ExecuteAllEventsUpToCurrentAnimationTime(this.animationTime);
                    this.startedThisFrame = false;
                }

                //draw animation
                this.DrawAllAnimationsThatArePlayingRightNow(this.animationTime);
            }
            else
            {
                //animation is not paused

                if (this.startedThisFrame === false)
                {
                    //animation did not start this frame
    
                    this.animationTime += deltaTime;
    
                    //if animation time passed the end of the animation, then it is either going to be stopped or continue showing last frame
                    if (this.animationTime > this.animationTotalTime)
                    {
                        this.animationTime = this.animationTotalTime;
    
                        if (this.stopAfterCompletion == true)
                        {
                            this.animationRunning == false;
                            return;
                        }
                    }
                }
                else
                {
                    //animation started this frame
                    //on the first frame, we don't want to take into account delta time, because the time === 0 would be skipped
    
                    this.startedThisFrame = false;
                }
    
                //all events up to the present time will be executed
                this.ExecuteAllEventsUpToCurrentAnimationTime(this.animationTime);
    
                //events are done, now we have to draw current state of the animation
                this.DrawAllAnimationsThatArePlayingRightNow(this.animationTime);
            }
		}
	}

    AddEventToCalendar(executeTime, functionToExecute)
    {
        //executeTime, alreadyExecuted, functionToExecute, 
        this.eventCalendar.push([executeTime, false, functionToExecute]);

        //update animationTotalTime if execute time is after current animationTotalTime
        this.animationTotalTime = executeTime > this.animationTotalTime ? executeTime : this.animationTotalTime;
    }

    AddAnimationToCalendar(startTime, endTime, functionToExecute)
    {
        this.animationCalendar.push([startTime, endTime, functionToExecute]);

        //update animationTotalTime if endTime is after current animationTotalTime
        this.animationTotalTime = endTime > this.animationTotalTime ? endTime : this.animationTotalTime;
    }

    ResetAnimation()
    {
        this.animationRunning = false;

		this.animationTime = 0;
        this.animationTotalTime = 0;
		
		this.animationCalendar = [];
		this.eventCalendar = [];

        this.startedThisFrame = false;
    }

	ExecuteAllEventsUpToCurrentAnimationTime(animationTime)
	{
		//execute all events in order up to current time
		for (let i = 0; i < this.eventCalendar.length; i++)
		{
			if (this.eventCalendar[i][1] === false && this.eventCalendar[i][0] <= animationTime)
			{
				this.eventCalendar[i][2]();
                this.eventCalendar[i][1] = true;
			}
		}
	}
	
    //returns all animations, that should be playing right now
	FindAllAnimationsThatArePlayingRightNow(animationTime)
	{
		let animationsPlayingRightNow = [];
		
		//cycle through all animations and check, whether current time is inside the animation duration
		for (let i = 0; i < this.animationCalendar.length; i++)
		{
            //if we are at the end of animation, then we want to play even those subanimations, whose end time is equal to animation total time
            //otherwise we don't play specific subanimation when animation time equals its end time, because if animation time would fall
            //right into that threshold and other subanimation would start at this threshold, then they would be shown at the same time
            //another problem is that event at that threshold would be executed first and could possibly invalidate data for old subanimation ending at that threshold
            if (this.animationTime === this.animationTotalTime)
            {
                if (animationTime >= this.animationCalendar[i][0] && animationTime <= this.animationCalendar[i][1])
                {			
                    animationsPlayingRightNow.push(this.animationCalendar[i]);
                }
            }
            else
            {  
			    if (animationTime >= this.animationCalendar[i][0] && animationTime < this.animationCalendar[i][1])
			    {			
				    animationsPlayingRightNow.push(this.animationCalendar[i]);
			    }
            }
		}
		
		return animationsPlayingRightNow;
	}
	
    //calls draw functions for all currently running animations
	DrawAllAnimationsThatArePlayingRightNow(animationTime)
	{
        let animationsPlayingRightNow = this.FindAllAnimationsThatArePlayingRightNow(animationTime);

		for (let i = 0; i < animationsPlayingRightNow.length; i++)
		{
            let percentage = (animationTime - animationsPlayingRightNow[i][0])/(animationsPlayingRightNow[i][1] - animationsPlayingRightNow[i][0]);

			animationsPlayingRightNow[i][2](percentage);
		}
	}
}













