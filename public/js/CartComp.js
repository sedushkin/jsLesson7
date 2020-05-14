Vue.component('cart', {
    data(){
      return {
          imgCart: 'https://placehold.it/50x100',
          cartUrl: '/getBasket.json',
          cartItems: [],
          showCart: false,
          thisDate: 'thisDate',
      }
    },
    methods: {
        addProduct(product){
            let find = this.cartItems.find(el => el.id_product === product.id_product);
            if(find){
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1});
                find.quantity++;

                // this.$parent.putJson(`/api/stat`, {status: 'добавлено количество', date: `${thisDate}`, name: find.product_name});
            } else {
                let prod = Object.assign({quantity: 1}, product);
                this.$parent.postJson('/api/cart', prod)
                  .then(data => {
                      if (data.result === 1) {
                          this.cartItems.push(prod);

                          // this.$parent.changeStatsJson(`/api/stat/${prod.id_product}`, {status: 'Добавлен продукт', date: `${thisDate}`, name: prod.product_name});
                      }
                  });
            }
        },

        remove(item) {
            let find = this.cartItems.find(el => el.id_product === item.id_product);
            if(find.quantity>1) {
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: -1});
                find.quantity--;
                // this.$parent.changeStatsJson(`/api/cart/${find.id_product}`, {status: 'Уменьшено количество', date: dateTime, name: find.product_name});
            }else {
                this.$parent.deleteJson(`/api/cart/${find.id_product}`, find)
                    .then(data => {
                        if (data.result === 1) {
                           this.cartItems.splice(this.cartItems.indexOf(item), 1);
                            // this.$parent.changeStatsJson(`/api/cart/${find.id_product}`, {status: 'Удалён продукт', date: dateTime, name: find.product_name});
                        }
                    });

            }
         },

    },

    mounted(){
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for(let el of data.contents){
                    this.cartItems.push(el);
                }
            });
    },
    template: `
        <div>
            <button class="btn-cart" type="button" @click="showCart = !showCart">Корзина</button>
            <div class="cart-block" v-show="showCart">
                <p v-if="!cartItems.length">Корзина пуста</p>
                <cart-item class="cart-item" 
                v-for="item of cartItems" 
                :key="item.id_product"
                :cart-item="item" 
                :img="imgCart"
                @remove="remove">
                </cart-item>
            </div>
        </div>`
});

Vue.component('cart-item', {
    props: ['cartItem', 'img'],
    template: `
                <div class="cart-item">
                    <div class="product-bio">
                        <img :src="img" alt="Some image">
                        <div class="product-desc">
                            <p class="product-title">{{cartItem.product_name}}</p>
                            <p class="product-quantity">Количество: {{cartItem.quantity}}</p>
                            <p class="product-single-price">{{cartItem.price}}₽ за единицу</p>
                        </div>
                    </div>
                    <div class="right-block">
                        <p class="product-price">{{cartItem.quantity*cartItem.price}}₽</p>
                        <button class="del-btn" @click="$emit('remove', cartItem)">&times;</button>
                    </div>
                </div>
    `
});
