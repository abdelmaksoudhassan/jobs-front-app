<template>
    <nav>
        <div class="links">
            <RouterLink :to="{name: 'updateinfo'}" class="link" active-class="active">Update info</RouterLink>
            <span> | </span>
            <RouterLink :to="{name: 'moreinfo'}" class="link" active-class="active">More info</RouterLink>
        </div>
    </nav>
    <main>
        <RouterView />
    </main>
</template>